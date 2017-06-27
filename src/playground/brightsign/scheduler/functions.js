'use strict';

import moment from 'moment';

import {isNull, isArray, stubTrue, stubFalse, castArray, partial, cond, chain, map, trim, sortBy, cloneDeep} from 'lodash';
import {EVERY_DAY_NAME, EVERY_WEEKDAY_NAME, EVERY_WEEKEND_NAME, WEEK_DAYS_NUMBERS, WEEK_ENDS_NUMBERS, ALL_DAYS_NUMBERS} from './constants';

export const toLowerCaseAndTrim = userString => trim(userString.toLowerCase());

export const parseEventWeekDays = (daysOfWeek) => {
    const splitDaysOfWeek = daysOfWeek.split(',');
    const parsedDaysOfWeek = isArray(splitDaysOfWeek) ? splitDaysOfWeek : castArray(daysOfWeek);

    return map(parsedDaysOfWeek, toLowerCaseAndTrim);
};

export const parseEventDuration = (eventDuration) => {
    let parsedTimeData = eventDuration.split(':');
    let daysData = parsedTimeData[0].split('.');

    if (daysData.length > 1) {
        parsedTimeData.shift();
        parsedTimeData.unshift(daysData[1]);
        parsedTimeData.unshift(daysData[0]);
    }

    return parsedTimeData;
};

export const extractPossibleWeekDaysFromEvent = (daysOfWeek) => {
    const parsedDaysOfWeek = parseEventWeekDays(daysOfWeek);
    const testMomentDate = moment();

    return chain(parsedDaysOfWeek).reduce((daysNumbers, dayName) => {

        if (dayName === EVERY_DAY_NAME.toLowerCase()) {
            daysNumbers = daysNumbers.concat(ALL_DAYS_NUMBERS);
        } else if (dayName === EVERY_WEEKDAY_NAME.toLowerCase()) {
            daysNumbers = daysNumbers.concat(WEEK_DAYS_NUMBERS);
        } else if (dayName === EVERY_WEEKEND_NAME.toLowerCase()) {
            daysNumbers = daysNumbers.concat(WEEK_ENDS_NUMBERS);
        } else {
            testMomentDate.day(dayName);
            daysNumbers.push(testMomentDate.day());
        }

        return daysNumbers;
    }, []).uniq().sortBy().value();
};

const addDuration = (userDate, durationData) => {
    let newUserDate = moment(userDate);
    let startIndex = 0;

    if (durationData.length === 4) {
        newUserDate.add(durationData[startIndex], 'd');
        startIndex = 1;
    }

    return newUserDate.add(durationData[startIndex], 'h').add(durationData[startIndex + 1], 'm').add(durationData[startIndex + 2], 's');
};

const setDuration = (userDate, durationData) => {
    let newUserDate = moment(userDate);
    let startIndex = 0;

    if (durationData.length === 4) {
        newUserDate.add(durationData[startIndex], 'd');
        startIndex = 1;
    }
    return newUserDate.set('h', durationData[startIndex]).set('m', durationData[startIndex + 1],).set('s', durationData[startIndex + 2]);
};

export const addTimeToDate = (userDate, userTime) => {
    const userDateCopy = moment(userDate);
    const parsedUserTime = parseEventDuration(userTime);

    return addDuration(userDateCopy, parsedUserTime);
};

export const setTimePartOfDate = (userDate, userTime) => {
    const userDateCopy = moment(userDate);
    const parsedUserTime = parseEventDuration(userTime);

    return setDuration(userDateCopy, parsedUserTime);
};

export const testPeriodStartEndTimeFitsPeriod = (eventStartDateTime, eventEndDateTime, periodStartDateTime, periodEndDateTime) => {
    let eventStartDateTimeFits = eventStartDateTime.isSameOrBefore(periodStartDateTime) || eventStartDateTime.isBetween(periodStartDateTime, periodEndDateTime, null, '[)');
    let eventEndDateTimeFits = eventEndDateTime.isSameOrAfter(periodEndDateTime) || eventEndDateTime.isBetween(periodStartDateTime, periodEndDateTime, null, '(]');

    return eventStartDateTimeFits && eventEndDateTimeFits;
};

export const testNoRecurrentPresentation = (startDateTime, endDateTime, presentationData) => {
    const eventStartDateTime = setTimePartOfDate(presentationData.eventDate, presentationData.startTime);
    const eventEndDateTime = addTimeToDate(eventStartDateTime, presentationData.duration);

    return testPeriodStartEndTimeFitsPeriod(eventStartDateTime, eventEndDateTime, startDateTime, endDateTime);
};

export const findRecurrentPresentationStartDateTime = (startDateTime, presentationData) => {
    const startDateTimeCopy = moment(startDateTime);
    const presentationDaysOfWeek = extractPossibleWeekDaysFromEvent(presentationData.daysOfWeek);

    let startDay = startDateTimeCopy.day();

    while(presentationDaysOfWeek.indexOf(startDay) === -1) {
        startDateTimeCopy.subtract(1, 'day');
        startDay = startDateTimeCopy.day();
    }

    return startDateTimeCopy;
};

export const convertRecurrentToNoneRecurrentPresentation = (startDateTime, endDateTime, presentationData) => {
    const startDateTimeCopy = moment(startDateTime).subtract(1, 'day');

    let recurrenceStartDateTime = isNull(presentationData.recurrenceStartDate) ? findRecurrentPresentationStartDateTime(startDateTimeCopy, presentationData) : moment(presentationData.recurrenceStartDate);
    let recurrenceEndDateTime = isNull(presentationData.recurrenceEndDate) ? moment(endDateTime) : moment(presentationData.recurrenceEndDate);

    const presentationDaysOfWeek = extractPossibleWeekDaysFromEvent(presentationData.daysOfWeek);
    const chunkedPresentations = [];

    const starDateTimeDaysDiff = moment(startDateTime).diff(recurrenceStartDateTime, 'days');

    if (starDateTimeDaysDiff >= 7) {
        recurrenceStartDateTime = moment(startDateTime).subtract(7, 'day')
    }

    while(recurrenceStartDateTime.isBefore(recurrenceEndDateTime)) {
        const currendWeekDay = recurrenceStartDateTime.day();

        if (presentationDaysOfWeek.indexOf(currendWeekDay) === -1) {
            recurrenceStartDateTime.add(1, 'day');
            continue;
        } else {
            chunkedPresentations.push({
                ...presentationData,
                'isRecurrent': false,
                'eventDate': recurrenceStartDateTime.format('YYYY-MM-DD'),

                'recurrenceStartDate': null,
                'recurrenceEndDate': null,

                'daysOfWeek': null,

                'originalData': cloneDeep(presentationData)
            });

            recurrenceStartDateTime.add(1, 'day');
        }
    }

    return chunkedPresentations;
};

export const isPresentationRecurrent = presentation => presentation.isRecurrent;

export const convertPresentationsToNoneRecurrentFormat = (startDateTime, endDateTime, presentationsData) => {
    const converterFunc = partial(convertRecurrentToNoneRecurrentPresentation, startDateTime, endDateTime);

    return chain(presentationsData).reduce((preparedPresentationsData, presentationData) => {
        const preparedPresentationData = isPresentationRecurrent(presentationData) ? converterFunc(presentationData) : castArray(presentationData);
        return preparedPresentationsData.concat(preparedPresentationData);
    }, []).value();
};

export const findPresentationsForPeriod = (startDateTime, endDateTime, presentationsData) => {
    const startDateTimeCopy = moment(startDateTime);
    const endDateTimeCopy = moment(endDateTime);

    const convertedPresentations = convertPresentationsToNoneRecurrentFormat(startDateTime, endDateTime, presentationsData);
    const testNoRecurrent = partial(testNoRecurrentPresentation, startDateTimeCopy, endDateTimeCopy);

    const testIfPresentationFits = cond([
        [presentation => !isPresentationRecurrent(presentation) && testNoRecurrent(presentation), stubTrue],
        [stubTrue, stubFalse]
    ]);

    return chain(convertedPresentations).filter(testIfPresentationFits).cloneDeep().value();
};

export const normalizeNoRecurrentPresentationForScheduler = (startDateTime, endDateTime, presentationData) => {
    let eventStartDateTime = setTimePartOfDate(presentationData.eventDate, presentationData.startTime);
    let eventEndDateTime = addTimeToDate(eventStartDateTime, presentationData.duration);

    eventStartDateTime = eventStartDateTime.isBefore(startDateTime) ? moment(startDateTime) : eventStartDateTime;
    eventEndDateTime = eventEndDateTime.isAfter(endDateTime) ? moment(endDateTime) : eventEndDateTime;

    return {name: presentationData.presentationName, period: presentationData.originalData.daysOfWeek, eventStartDateTime, eventEndDateTime};
};

export const preparePresentationsForScheduler = (startDateTime, endDateTime, presentationsData) => {
    const startDateTimeCopy = moment(startDateTime);
    const endDateTimeCopy = moment(endDateTime);

    const convertedPresentations = convertPresentationsToNoneRecurrentFormat(startDateTime, endDateTime, presentationsData);

    const normalizationFunc = partial(normalizeNoRecurrentPresentationForScheduler, startDateTimeCopy, endDateTimeCopy);
    let preparedPresentationsForScheduler = [];

    while(startDateTimeCopy.isBefore(endDateTimeCopy)) {
        const foundPresentations = findPresentationsForPeriod(startDateTimeCopy, moment(startDateTimeCopy).add(1, 'd'), convertedPresentations);
        const preparedPresentations = map(foundPresentations, normalizationFunc);

        preparedPresentationsForScheduler = preparedPresentationsForScheduler.concat(preparedPresentations);
        startDateTimeCopy.add(1, 'd');
    }

    return sortBy(preparedPresentationsForScheduler, presentationData => moment(presentationData.eventStartDateTime).valueOf());
};

export const preparePresentationsForDayScheduler = (startDateTime, presentationsData) => {
    const startDateTimeCopy = moment(startDateTime).set('h', 0).set('m', 0).set('s', 0).set('ms', 0);
    const endDateTime = moment(startDateTimeCopy).add(1, 'd');

    return preparePresentationsForScheduler(startDateTimeCopy, endDateTime, presentationsData);
};

export const preparePresentationsForWeekSchedulerFromSunday = (startDateTime, presentationsData) => {
    const startDateTimeCopy = moment(startDateTime).set('h', 0).set('m', 0).set('s', 0).set('ms', 0);
    let startDateTimeWeekDayCopy = startDateTimeCopy.weekday();

    while(startDateTimeWeekDayCopy !== 0) {
        startDateTimeCopy.subtract(1, 'd');
        startDateTimeWeekDayCopy = startDateTimeCopy.weekday();
    }

    const endDateTime = moment(startDateTimeCopy).add(7, 'd');
    const weekPresentations = preparePresentationsForScheduler(startDateTimeCopy, endDateTime, presentationsData);

    const startDateTimeCounter = moment(startDateTimeCopy);
    const endDateTimeCounter = moment(startDateTimeCounter).add(1, 'd');
    const weekPresentationsByDay = [];

    do {
        const presentationsInArray = chain(weekPresentations).filter((presentation) => {
            const isStartDateTimeFits = moment(presentation.eventStartDateTime).isBetween(startDateTimeCounter, endDateTimeCounter, null, '[)');
            const isEndDateTimeFits = moment(presentation.eventEndDateTime).isBetween(startDateTimeCounter, endDateTimeCounter, null, '(]');

            return isStartDateTimeFits && isEndDateTimeFits;
        }).reduce((presentationsArray, presentation) => {
            presentationsArray.push(presentation);
            return presentationsArray;
        }, []).value();

        weekPresentationsByDay.push(presentationsInArray);

        startDateTimeCounter.add(1, 'd');
        endDateTimeCounter.add(1, 'd');
    } while(endDateTimeCounter.isSameOrBefore(endDateTime));

    return weekPresentationsByDay;
};
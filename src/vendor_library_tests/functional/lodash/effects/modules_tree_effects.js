'use strict';

// external imports
const {isNil, curry} = require('lodash/fp');
const chalk = require('chalk');

// local imports
const {DIRECTORIES_TO_EXCLUDE} = require('./../constants/exclusion_constants');

const {addNodeModulesDir, removeLastPathEntity} = require('./../helpers/path_helpers');
const {isExclusion} = require('./../helpers/validation_helpers');
const {joinTwoPaths} = require('./../helpers/path_helpers');
const {generateSync} = require('./../helpers/promise_sync_helpers');
const {getPathsTraversedQueryWrappers} = require('./../helpers/db_helpers');

const {isPathAlreadyTraversed, insertModuleData, insertDependencyListToDB} = require('./../effects/db_effects');
const {readPackageJSON, traverseDirectoryRecursive, traverseNodeModulesDirectory} = require('./../effects/fs_effects');

// helpers implementation
const filterTraversedPath = curry((dbConnection, dbType, path) => {
    return generateSync(function* (dbConnection, dbType, path) {
        const isPathVisited = yield isPathAlreadyTraversed(dbConnection, path);

        if (isPathVisited === false) {
            console.log('----------------------------', path);
            let preparedPath = removeLastPathEntity(path);
            yield getPathsTraversedQueryWrappers(dbType).insertNewPath(dbConnection, preparedPath);
        }

        yield isPathVisited;
    })(dbConnection, dbType, path);
});

const handleModuleData = curry((dbConnection, originalPath, pathToParentNodeModules, packageDirName, installedChildNodeModules) => {
    return generateSync(function* () {
        // compose full path to module
        const pathToModule = joinTwoPaths(pathToParentNodeModules, packageDirName);

        console.log(chalk.green(`Processing package in '${pathToModule}'`));

        // apply filter to directory name
        if (isExclusion(DIRECTORIES_TO_EXCLUDE, packageDirName)) {
            return;
        }

        // read package.json
        const currentPackageJSON = readPackageJSON(pathToModule);

        // extract name and version of the current module
        const {name, version} = currentPackageJSON;

        // insert current module data to DB
        const currentModuleLocationID = yield insertModuleData(dbConnection, name, version, pathToModule, null);

        if (isNil(currentModuleLocationID)) {
            yield null;
            return;
        }

        // extract module dependencies lists
        let {dependencies, devDependencies, peerDependencies} = currentPackageJSON;

        // insert dependencies data from package.json into DB
        yield insertDependencyListToDB(dbConnection, dependencies, pathToModule, currentModuleLocationID, 'dependency');
        yield insertDependencyListToDB(dbConnection, devDependencies, pathToModule, currentModuleLocationID, 'devDependencies');
        yield insertDependencyListToDB(dbConnection, peerDependencies, pathToModule, currentModuleLocationID, 'peerDependencies');

        // return package name (consistency reason)
        yield packageDirName;
    })();
});

const extractAndSaveModuleData = curry((dbConnection, dbType, pathToRootNodeModules) => {
    return generateSync(function* (dbConnection, dbType, pathToRootNodeModules) {
        yield handleModuleData(dbConnection, '', pathToRootNodeModules, '', []);

        yield traverseDirectoryRecursive(
            handleModuleData(dbConnection),
            traverseNodeModulesDirectory,
            filterTraversedPath(dbConnection, dbType),
            addNodeModulesDir,
            pathToRootNodeModules,
        );
    })(dbConnection, dbType, pathToRootNodeModules);
});

// export
exports.filterTraversedPath = filterTraversedPath;
exports.handleModuleData = handleModuleData;
exports.extractAndSaveModuleData = extractAndSaveModuleData;
"use strict";
/*
 * Copyright IBM Corporation 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const index_1 = require("../../index");
chai_1.should();
describe('Connect Cloud Health test suite', function () {
    it('Liveness returns 200 OK and STARTING on readiness check starting', function (done) {
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 200;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"STARTING\",\"checks\":[{\"name\":\"startup\",\"state\":\"STARTING\",\"data\":{\"reason\":\"\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerReadinessCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.ReadinessCheck("startup", new Promise(function (resolve, reject) {
            resolve();
        })));
        index_1.LivenessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
    });
    it('Liveness returns 200 OK and UP on liveness success', function (done) {
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerLivenessCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.LivenessCheck("test1", new Promise(function (resolve, reject) {
            resolve();
        })));
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            //write: sinon.stub(),
            end: function () {
                let expectedStatus = 200;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"UP\",\"checks\":[{\"name\":\"test1\",\"state\":\"UP\",\"data\":{\"reason\":\"\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        index_1.LivenessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
    });
    it('Liveness returns 503 Unavailable and DOWN on liveness fail', function (done) {
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerLivenessCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.LivenessCheck("test1", new Promise(function (resolve, reject) {
            throw new Error("Liveness Failure");
        })));
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 503;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"DOWN\",\"checks\":[{\"name\":\"test1\",\"state\":\"DOWN\",\"data\":{\"reason\":\"Liveness Failure\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        index_1.LivenessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
    });
    it('Liveness returns 503 OK and STOPPING on STOPPING', function (done) {
        process.removeAllListeners('SIGTERM');
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerShutdownCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.ShutdownCheck("test1", new Promise(function (resolve, reject) {
            // tslint:disable-next-line:no-shadowed-variable no-unused-expression
            new Promise(function (resolve, _reject) {
                setTimeout(resolve, 1000, 'foo');
            });
        })));
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 503;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"STOPPING\",\"checks\":[{\"name\":\"test1\",\"state\":\"STOPPING\",\"data\":{\"reason\":\"\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        process.once('SIGTERM', () => {
            index_1.LivenessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
        });
        process.kill(process.pid, 'SIGTERM');
    });
    it('Liveness returns 503 OK and STOPPED on STOPPED', function (done) {
        process.removeAllListeners('SIGTERM');
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerShutdownCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.ShutdownCheck("test1", new Promise(function (resolve, reject) {
            // tslint:disable-next-line:no-shadowed-variable no-unused-expression
            resolve();
        })));
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 503;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"STOPPED\",\"checks\":[{\"name\":\"test1\",\"state\":\"STOPPED\",\"data\":{\"reason\":\"\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        process.once('SIGTERM', () => {
            index_1.LivenessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
        });
        process.kill(process.pid, 'SIGTERM');
    });
    it('Readiness returns 503 Unavailable and DOWN on readiness fail', function (done) {
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerReadinessCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.ReadinessCheck("test1", new Promise(function (resolve, reject) {
            throw new Error("Readiness Failure");
        })))
            .then(() => {
            index_1.ReadinessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
        });
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 503;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"DOWN\",\"checks\":[{\"name\":\"test1\",\"state\":\"DOWN\",\"data\":{\"reason\":\"Readiness Failure\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
    });
    it('Readiness returns 503 Unavailable and STARTING on readiness check starting', function (done) {
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 503;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"STARTING\",\"checks\":[{\"name\":\"startup\",\"state\":\"STARTING\",\"data\":{\"reason\":\"\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerReadinessCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.ReadinessCheck("startup", new Promise(function (resolve, reject) {
            resolve();
        })));
        index_1.ReadinessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
    });
    it('Readiness returns 200 OK and UP on readiness and liveness checks', function (done) {
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerReadinessCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.ReadinessCheck("startup", new Promise(function (resolve, reject) {
            resolve();
        })))
            .then(() => {
            index_1.ReadinessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
        });
        cloudHealth.registerLivenessCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.LivenessCheck("liveness", new Promise(function (resolve, reject) {
            resolve();
        })));
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 200;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"UP\",\"checks\":[{\"name\":\"liveness\",\"state\":\"UP\",\"data\":{\"reason\":\"\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        //ConnectHealth(cloudHealth)(<http.IncomingMessage>reqStub, <http.ServerResponse>resStub, <NextFunction>nextStub)
    });
    it('Readiness returns 503 OK and STOPPING on STOPPING', function (done) {
        process.removeAllListeners('SIGTERM');
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerShutdownCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.ShutdownCheck("test1", new Promise(function (resolve, reject) {
            // tslint:disable-next-line:no-shadowed-variable no-unused-expression
            new Promise(function (resolve, _reject) {
                setTimeout(resolve, 1000, 'foo');
            });
        })));
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 503;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"STOPPING\",\"checks\":[{\"name\":\"test1\",\"state\":\"STOPPING\",\"data\":{\"reason\":\"\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        process.once('SIGTERM', () => {
            index_1.ReadinessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
        });
        process.kill(process.pid, 'SIGTERM');
    });
    it('Readiness returns 503 OK and STOPPED on STOPPED', function (done) {
        process.removeAllListeners('SIGTERM');
        let cloudHealth = new index_1.HealthChecker();
        cloudHealth.registerShutdownCheck(
        // tslint:disable-next-line:no-shadowed-variable
        new index_1.ShutdownCheck("test1", new Promise(function (resolve, reject) {
            // tslint:disable-next-line:no-shadowed-variable no-unused-expression
            resolve();
        })));
        const reqStub = {};
        const nextStub = {};
        const resStub = {
            write: sinon_1.default.stub(),
            end: function () {
                let expectedStatus = 503;
                let code = resStub.statusCode ? resStub.statusCode : 0;
                code.should.equals(expectedStatus, `Should return: ${expectedStatus}, but returned: ${code}`);
                let expectedBody = "{\"status\":\"STOPPED\",\"checks\":[{\"name\":\"test1\",\"state\":\"STOPPED\",\"data\":{\"reason\":\"\"}}]}";
                sinon_1.default.assert.calledWith(resStub.write, expectedBody);
                done();
            }
        };
        process.once('SIGTERM', () => {
            index_1.ReadinessEndpoint(cloudHealth)(reqStub, resStub, nextStub);
        });
        process.kill(process.pid, 'SIGTERM');
    });
});
//# sourceMappingURL=ConnectHealth.test.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
const health_1 = require("@cloudnative/health");
exports.HealthChecker = health_1.HealthChecker;
exports.StartupCheck = health_1.StartupCheck;
exports.ReadinessCheck = health_1.ReadinessCheck;
exports.LivenessCheck = health_1.LivenessCheck;
exports.ShutdownCheck = health_1.ShutdownCheck;
exports.PingCheck = health_1.PingCheck;
var StateCode;
(function (StateCode) {
    StateCode[StateCode["OK"] = 200] = "OK";
    StateCode[StateCode["DOWN"] = 503] = "DOWN";
    StateCode[StateCode["ERRORED"] = 500] = "ERRORED";
})(StateCode || (StateCode = {}));
function HealthEndpoint(checker) {
    let middleware = function (req, res, next) {
        checker.getStatus()
            .then((status) => {
            switch (status.status) {
                case health_1.State.STARTING:
                    res.statusCode = StateCode.DOWN;
                    break;
                case health_1.State.UP:
                    res.statusCode = StateCode.OK;
                    break;
                case health_1.State.DOWN:
                    res.statusCode = StateCode.DOWN;
                    break;
                case health_1.State.STOPPING:
                    res.statusCode = StateCode.DOWN;
                    break;
                case health_1.State.STOPPED:
                    res.statusCode = StateCode.DOWN;
                    break;
            }
            res.write(JSON.stringify(status));
            res.end();
        })
            .catch((err) => { res.end(); });
    };
    return middleware;
}
exports.HealthEndpoint = HealthEndpoint;
function LivenessEndpoint(checker) {
    let middleware = function (req, res, next) {
        checker.getLivenessStatus()
            .then((status) => {
            switch (status.status) {
                case health_1.State.STARTING:
                    res.statusCode = StateCode.OK;
                    break;
                case health_1.State.UP:
                    res.statusCode = StateCode.OK;
                    break;
                case health_1.State.DOWN:
                    res.statusCode = StateCode.DOWN;
                    break;
                case health_1.State.STOPPING:
                    res.statusCode = StateCode.DOWN;
                    break;
                case health_1.State.STOPPED:
                    res.statusCode = StateCode.DOWN;
                    break;
            }
            res.write(JSON.stringify(status));
            res.end();
        })
            .catch((err) => { res.end(); });
    };
    return middleware;
}
exports.LivenessEndpoint = LivenessEndpoint;
function ReadinessEndpoint(checker) {
    let middleware = function (req, res, next) {
        checker.getReadinessStatus()
            .then((status) => {
            res.statusCode = StateCode.OK;
            switch (status.status) {
                case health_1.State.STARTING:
                    res.statusCode = StateCode.DOWN;
                    break;
                case health_1.State.UP:
                    res.statusCode = StateCode.OK;
                    break;
                case health_1.State.DOWN:
                    res.statusCode = StateCode.DOWN;
                    break;
                case health_1.State.STOPPING:
                    res.statusCode = StateCode.DOWN;
                    break;
                case health_1.State.STOPPED:
                    res.statusCode = StateCode.DOWN;
                    break;
            }
            res.write(JSON.stringify(status));
            res.end();
        })
            .catch((err) => { res.end(); });
    };
    return middleware;
}
exports.ReadinessEndpoint = ReadinessEndpoint;
//# sourceMappingURL=ConnectHealth.js.map
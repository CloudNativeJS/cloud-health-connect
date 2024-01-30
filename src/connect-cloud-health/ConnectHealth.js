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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCheck = exports.ShutdownCheck = exports.LivenessCheck = exports.ReadinessCheck = exports.StartupCheck = exports.HealthChecker = exports.ShieldEndpoint = exports.ReadinessEndpoint = exports.LivenessEndpoint = exports.HealthEndpoint = void 0;
const health_1 = require("@cloudnative/health");
Object.defineProperty(exports, "HealthChecker", { enumerable: true, get: function () { return health_1.HealthChecker; } });
Object.defineProperty(exports, "StartupCheck", { enumerable: true, get: function () { return health_1.StartupCheck; } });
Object.defineProperty(exports, "ReadinessCheck", { enumerable: true, get: function () { return health_1.ReadinessCheck; } });
Object.defineProperty(exports, "LivenessCheck", { enumerable: true, get: function () { return health_1.LivenessCheck; } });
Object.defineProperty(exports, "ShutdownCheck", { enumerable: true, get: function () { return health_1.ShutdownCheck; } });
Object.defineProperty(exports, "PingCheck", { enumerable: true, get: function () { return health_1.PingCheck; } });
const HealthLogo_1 = require("./HealthLogo");
var StateCode;
(function (StateCode) {
    StateCode[StateCode["OK"] = 200] = "OK";
    StateCode[StateCode["DOWN"] = 503] = "DOWN";
    StateCode[StateCode["ERRORED"] = 500] = "ERRORED";
})(StateCode || (StateCode = {}));
const stateShield = {
    [health_1.State.UP]: { message: 'up', color: 'green' },
    [health_1.State.DOWN]: { message: 'down', color: 'red' },
    [health_1.State.UNKNOWN]: { message: 'unknown', color: 'yellow' },
    [health_1.State.STOPPED]: { message: 'stopped', color: 'grey' },
    [health_1.State.STOPPING]: { message: 'stopping', color: 'orange' },
    [health_1.State.STARTING]: { message: 'starting', color: 'blue' },
};
const shieldSchema = {
    schemaVersion: 1,
    labelColor: 'lightgrey',
};
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
function ShieldEndpoint(checker, label = 'health', logoSvg = HealthLogo_1.logo) {
    const middleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            res.statusCode = StateCode.OK;
            const { status } = yield checker.getStatus();
            const shield = Object.assign(Object.assign({ label,
                logoSvg }, shieldSchema), ((_a = stateShield[status]) !== null && _a !== void 0 ? _a : stateShield[health_1.State.UNKNOWN]));
            res.write(JSON.stringify(shield));
            res.end();
        }
        catch (err) {
            res.end();
        }
    });
    return middleware;
}
exports.ShieldEndpoint = ShieldEndpoint;
//# sourceMappingURL=ConnectHealth.js.map
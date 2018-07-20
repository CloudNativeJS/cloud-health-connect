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

import {HealthChecker, ReadinessCheck, LivenessCheck, ShutdownCheck, State} from '@cloudnative/health';
import {NextHandleFunction, NextFunction} from 'connect';
import * as http from "http";

enum StateCode {
    OK = 200,
    DOWN = 503,
    ERRORED = 500
}

function LivenessEndpoint(checker: HealthChecker): NextHandleFunction {

    let middleware = <NextHandleFunction> function (req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction) {
        checker.getStatus()
        .then((status) => {
            switch (status.status) {
                case State.STARTING:    res.statusCode = StateCode.OK; break;
                case State.UP:          res.statusCode = StateCode.OK; break;
                case State.DOWN:        res.statusCode = StateCode.DOWN; break;
                case State.STOPPING:    res.statusCode = StateCode.DOWN; break;
                case State.STOPPED:     res.statusCode = StateCode.DOWN; break;
            }
            res.write(JSON.stringify(status));
            res.end()
        })
        .catch((err) => {next(err)})
    };
    return middleware
} 

function ReadinessEndpoint(checker: HealthChecker): NextHandleFunction {

    let middleware = <NextHandleFunction> function (req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction) {
        checker.getStatus()
        .then((status) => {
            res.statusCode = StateCode.OK
            switch (status.status) {
                case State.STARTING:    res.statusCode = StateCode.DOWN; break;
                case State.UP:          res.statusCode = StateCode.OK; break;
                case State.DOWN:        res.statusCode = StateCode.DOWN; break;
                case State.STOPPING:    res.statusCode = StateCode.DOWN; break;
                case State.STOPPED:     res.statusCode = StateCode.DOWN; break;
            }
            res.write(JSON.stringify(status));
            res.end();
        })
        .catch((err) => {next(err)})
    };
    return middleware
}

export { LivenessEndpoint, ReadinessEndpoint, HealthChecker, ReadinessCheck, LivenessCheck, ShutdownCheck };

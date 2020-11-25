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

import {HealthChecker, StartupCheck, ReadinessCheck, LivenessCheck, ShutdownCheck, State, PingCheck} from '@cloudnative/health';
import {NextHandleFunction, NextFunction} from 'connect';
import {logo} from './HealthLogo';
import * as http from "http";

enum StateCode {
    OK = 200,
    DOWN = 503,
    ERRORED = 500
}

type StateShieldValue = { message: string, color: string };

const stateShield: Record<State, StateShieldValue> = {
    [State.UP]:       { message: 'up',       color: 'green' },
    [State.DOWN]:     { message: 'down',     color: 'red' },
    [State.UNKNOWN]:  { message: 'unknown',  color: 'yellow' },
    [State.STOPPED]:  { message: 'stopped',  color: 'grey' },
    [State.STOPPING]: { message: 'stopping', color: 'orange' },
    [State.STARTING]: { message: 'starting', color: 'blue' },
};

const shieldSchema = {
    schemaVersion: 1,
    labelColor: 'lightgrey',
};

function HealthEndpoint(checker: HealthChecker): NextHandleFunction {
    let middleware = <NextHandleFunction> function (req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction) {
        checker.getStatus()
        .then((status) => {
            switch (status.status) {
                case State.STARTING:    res.statusCode = StateCode.DOWN; break;
                case State.UP:          res.statusCode = StateCode.OK; break;
                case State.DOWN:        res.statusCode = StateCode.DOWN; break;
                case State.STOPPING:    res.statusCode = StateCode.DOWN; break;
                case State.STOPPED:     res.statusCode = StateCode.DOWN; break;
            }
            res.write(JSON.stringify(status));
            res.end()
        })
        .catch((err) => {res.end()})
    };
    return middleware
} 

function LivenessEndpoint(checker: HealthChecker): NextHandleFunction {

    let middleware = <NextHandleFunction> function (req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction) {
        checker.getLivenessStatus()
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
        .catch((err) => {res.end()})
    };
    return middleware
} 

function ReadinessEndpoint(checker: HealthChecker): NextHandleFunction {

    let middleware = <NextHandleFunction> function (req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction) {
        checker.getReadinessStatus()
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
        .catch((err) => {res.end()})
    };
    return middleware
}

function ShieldEndpoint(checker: HealthChecker, label = 'health', logoSvg = logo): NextHandleFunction {
    const middleware: NextHandleFunction = async (req, res, next) => {
        try {
            res.statusCode = StateCode.OK;
            const { status } = await checker.getStatus();
            const shield = {
                label,
                logoSvg,
                ...shieldSchema,
                ...(stateShield[status] ?? stateShield[State.UNKNOWN]),
            };
            res.write(JSON.stringify(shield));
            res.end();
        } catch (err) {
            res.end();
        }
    };
    return middleware;
}

export { HealthEndpoint, LivenessEndpoint, ReadinessEndpoint, ShieldEndpoint, HealthChecker, StartupCheck, ReadinessCheck, LivenessCheck, ShutdownCheck, PingCheck };

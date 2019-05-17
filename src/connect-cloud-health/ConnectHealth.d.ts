import { HealthChecker, StartupCheck, ReadinessCheck, LivenessCheck, ShutdownCheck, PingCheck } from '@cloudnative/health';
import { NextHandleFunction } from 'connect';
declare function HealthEndpoint(checker: HealthChecker): NextHandleFunction;
declare function LivenessEndpoint(checker: HealthChecker): NextHandleFunction;
declare function ReadinessEndpoint(checker: HealthChecker): NextHandleFunction;
export { HealthEndpoint, LivenessEndpoint, ReadinessEndpoint, HealthChecker, StartupCheck, ReadinessCheck, LivenessCheck, ShutdownCheck, PingCheck };

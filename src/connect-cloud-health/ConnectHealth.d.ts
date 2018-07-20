import { HealthChecker, ReadinessCheck, LivenessCheck, ShutdownCheck } from '@cloudnative/health';
import { NextHandleFunction } from 'connect';
declare function LivenessEndpoint(checker: HealthChecker): NextHandleFunction;
declare function ReadinessEndpoint(checker: HealthChecker): NextHandleFunction;
export { LivenessEndpoint, ReadinessEndpoint, HealthChecker, ReadinessCheck, LivenessCheck, ShutdownCheck };

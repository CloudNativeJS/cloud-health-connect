import { HealthChecker, StartupCheck, ReadinessCheck, LivenessCheck, ShutdownCheck, PingCheck } from '@cloudnative/health';
import { NextHandleFunction } from 'connect';
declare function HealthEndpoint(checker: HealthChecker): NextHandleFunction;
declare function LivenessEndpoint(checker: HealthChecker): NextHandleFunction;
declare function ReadinessEndpoint(checker: HealthChecker): NextHandleFunction;
declare function ShieldEndpoint(checker: HealthChecker, label?: string, logoSvg?: string | undefined): NextHandleFunction;
export { HealthEndpoint, LivenessEndpoint, ReadinessEndpoint, ShieldEndpoint, HealthChecker, StartupCheck, ReadinessCheck, LivenessCheck, ShutdownCheck, PingCheck };

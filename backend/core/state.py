# Global state for tracking system health

class SystemState:
    api_quota_exhausted: bool = False

state = SystemState()

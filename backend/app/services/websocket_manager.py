import json
from typing import Dict, List, Optional
from fastapi import WebSocket

class ConsultationConnectionManager:
    """Manages active WebSockets per consultation_id for real-time chat."""
    def __init__(self):
        # Maps consultation_id -> list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, consultation_id: str, websocket: WebSocket):
        await websocket.accept()
        if consultation_id not in self.active_connections:
            self.active_connections[consultation_id] = []
        self.active_connections[consultation_id].append(websocket)

    def disconnect(self, consultation_id: str, websocket: WebSocket):
        if consultation_id in self.active_connections:
            if websocket in self.active_connections[consultation_id]:
                self.active_connections[consultation_id].remove(websocket)
            if not self.active_connections[consultation_id]:
                del self.active_connections[consultation_id]

    async def broadcast(self, consultation_id: str, message_data: dict):
        """Broadcasts payload to all clients connected to consultation_id."""
        if consultation_id in self.active_connections:
            dead_connections = []
            for connection in self.active_connections[consultation_id]:
                try:
                    await connection.send_text(json.dumps(message_data, default=str))
                except Exception:
                    dead_connections.append(connection)
            for dead in dead_connections:
                self.disconnect(consultation_id, dead)

# Global singleton connection manager
consultation_ws_manager = ConsultationConnectionManager()

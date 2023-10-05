from channels.consumer import AsyncConsumer
clients = []
rooms = []


class YourConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        print(dir(event))
        clients.append(self)
        await self.send({"type": "websocket.accept"})

    async def websocket_receive(self, text_data):

        for i in clients:
            print(i)
            if i != self:
                await i.send({"type": "websocket.send", "text": text_data['text']})

    async def websocket_disconnect(self, event):
        pass


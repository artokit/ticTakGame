from channels.consumer import AsyncConsumer
rooms = {}
boards = {}


class YourConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({"type": "websocket.accept"})

    async def websocket_receive(self, text_data):
        print(text_data)
        if text_data['text'].startswith('create'):
            print(text_data['text'])
            code = text_data['text'].split(':')[1]
            print(code)
            rooms[code] = [self]
            return await self.send({'type': 'websocket.send', 'text': "create:success"})
        
        if text_data['text'].startswith('join'):
            code = text_data['text'].split(':')[1]
            
            if not rooms.get(code):
                return await self.send({'type': 'websocket.send', 'text': 'error:Wrong code'})
            
            if len(rooms[code]) == 1:
                rooms[code].append(self)
                for num, client in enumerate(rooms[code]):
                    c = 'o' if not num else 'x'
                    await client.send({'type': 'websocket.send', 'text': f'start_game:{code}:{c}'})
        
        if text_data['text'].startswith('user_choice'):
            code = text_data['text'].split(':')[1]
            for i in rooms[code]:
                if i != self:
                    return await i.send({'type': 'websocket.send', 'text': text_data['text']})

    async def websocket_disconnect(self, event):
        pass


from channels.consumer import AsyncConsumer
rooms = {}
boards = {}


def check_win(board):
    #  Check diagonal.
    if set([board[0][0], board[1][1], board[2][2]]) in ({'x'}, {'o'}):
        return [0, 4, 8]
    
    if set([board[0][2], board[1][1], board[2][0]]) in ({'x'}, {'o'}):
        return [2, 4, 6]
    
    # Check straight.
    for i in range(2):
        if ''.join(board[i]) in ('xxx', 'ooo'):
            return [i*2 + j for j in range(2)]
    
    for i in range(2):
        if ''.join([board[0][i], board[1][i], board[2][i]]) in ('xxx', 'ooo'):
            return [i+j for j in range(0, 9, 3)]


def add_choice(choice, board, index):
    row = 0
    column = index

    while column > 2:
        row += 1
        column -= 3
    
    board[row][column] = choice


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
                boards[code] = [['']*3, ['']*3, ['']*3]
                for num, client in enumerate(rooms[code]):
                    c = 'o' if not num else 'x'
                    await client.send({'type': 'websocket.send', 'text': f'start_game:{code}:{c}'})
        
        if text_data['text'].startswith('user_choice'):
            _, code, choice, index = text_data['text'].split(':')
            index = int(index)
            # choice = text_data['text'].split(':')[2]
            add_choice(choice, boards[code], index)
            print(*boards[code])
            for i in rooms[code]:
                if i != self:
                    await i.send({'type': 'websocket.send', 'text': text_data['text']})
            
            res = check_win(boards[code])
            if res:
                for i in rooms[code]:
                    await i.send({'type': 'websocket.send', 'text': f'{choice}:{",".join(map(str, res))}:win'})
                

    async def websocket_disconnect(self, event):
        pass


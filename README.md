## How it works

Heavily utilizes callback functions

And you can derive how it works from here

```Javascript
let chat = new Connection(onMessageFn, onOpenFn)

//Creating/Hosting
chat.localOffer(callback)
//passes a offer(string) into your callback
chat.reciveAnswer(answer)
//recives and answer(string) and finishes setting up your connection

//Joining
chat.reciveOffer(offer, callback)
//recives and offer then passes answer(string) into your callback

//Chatting
chat.sendMessage(message)
//sends your message(string)

//when you recive a message it will trigger the onMessageFn you used to set up the Connection
```
# Tarval server
Yep.

# Spec
Connections to the server should be through a websocket using the `client` or `phone` protocols. When sending a message, you should use a JSON object with the following formatting:

```JSON
{
    "e": "eventName",
    "argument": "value",
    "argument2": "value"
}
```

The only required field is `e`.

## Phone protocol
The phone protocol is used for communication between the server and the (hurr) phone.

### Event: `getPin`
Assigns a pin to this connection and responds back with the pin.

**Expects arguments:**
* None

**Example response:**
```JSON
{
    "e": "setPin",
    "pin": 263
}
```

**NOTE:** The `pin` argument of the response may be changing in the future, as I'd like it to be a 4 character pairing pin.

### Event: `restorePin`
Assigns the given pin to this connection. Useful for reassigning your previous PIN after the app/connection closes.

**Expects arguments:**
* `pin`: The pin to assign

**Example response**
```JSON
{
    "e": "setPin",
    "pin": 263
}
```

### Event: `keyDown`
Tells the server that a button on the controller has been pressed down.

**Expects arguments:**
* `v`: The key code of the button pressed

**Example response:**
No response

### Event: `keyUp`
Tells the server that a button on the controller has been released.

**Expects arguments:**
* `v`: The key code of the button released

**Example response:**
No response

### Event `tilt`
Tells the server that the phone is currently being tilted by the user.

**Expects arguments:**
* `v`: The value of the accelerometer. *Should be a float between -1 and 1*.

**Example response:**
No response

## Client protocol
The client protocol is used for communication between the server and the desktop application which is receiving the phone events.

... Coming soon...

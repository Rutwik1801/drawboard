import React from "react";
import { useEffect } from "react";

export const useBroadcastChannel = (channelName: string) => {
const [message, setMessage] = React.useState(null);
const bc = new BroadcastChannel(channelName);

const sendMessage = (msg: any) => {
  bc.postMessage(msg);
}
useEffect(() => {
const handleMessage = (e: any) => {
setMessage(e.data)
}
bc.onmessage = handleMessage

return () => bc.close()
}, [bc])

return {message, sendMessage}
}
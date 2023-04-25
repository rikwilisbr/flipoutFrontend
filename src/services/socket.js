import React from 'react'
import io from 'socket.io-client'

export const socket = io.connect('http://localhost:2000')



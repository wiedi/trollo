"use strict"

var irc       = require('irc')
var Trello    = require('trello-events')
var ellipsize = require('ellipsize')

function formatMessage(event) {
	var message = ''
	var action = '?'
	switch(event.type) {
		case 'updateCard':
			if('closed' in event.data.old && event.data.card.closed == true) {
				action = 'closed'
			} else {
				action = 'update'
			}
			break
		case 'createCard':
			action = 'new'
			break
		case 'commentCard':
			action = 'comment'
			message = ' "' + ellipsize(event.data.text, 90) + '"'
			break
		case 'updateCheckItemStateOnCard':
			action = 'checklist'
			message = ' "' + event.data.checkItem.name + '" is now ' + event.data.checkItem.state
			break
		default:
			console.log(event)
	}
	var url = "https://trello.com/card/" + event.data.board.id + "/" + event.data.card.idShort
	return '[' + action + '] ' + event.memberCreator.username + ': ' + event.data.card.name + message + ' - ' + url
}

function main(config) {
	var enabled = false
	var client = new irc.Client(config.server, config.nick, {channels: [config.channel]})
	var trello = new Trello({pollFrequency: 1000 * 20, minId: 0, start: true, trello: config.trello })
	
	client.on('error', function(message) {
		console.log(message)
	})

	client.on('join', function(channel, nick, message) {
		if(nick == config.nick) {
			client.say(channel, 'Hi!');
		}
	})
	
	function sendMessage(event) {
		if(!enabled) return
		client.say(config.channel, formatMessage(event))
	}
	
	trello.on('maxId', function() {
		enabled = true
	})
	
	trello.on('commentCard', sendMessage)
	trello.on('updateCard',  sendMessage)
	trello.on('createCard',  sendMessage)
	trello.on('deleteCard',  sendMessage)
	trello.on('updateCard:closed', sendMessage)
	trello.on('updateCheckItemStateOnCard', sendMessage)
}

main(require('./config.json'))
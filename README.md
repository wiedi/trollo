# trollo

The Trello IRC Bot

## Installation

	npm install -g trollo
	$EDITOR /opt/local/etc/trollo.json # see configuration for an example
	svccfg import /opt/local/lib/node_modules/trollo/manifest.xml

## Configuration

You'll need an API Key & Token:
 - <https://trello.com/1/appKey/generate>
 - <https://trello.com/1/authorize?key=appkeygoeshere&name=trollo&expiration=never&response_type=token>

Example:

	{
		"server": "irc.xchannel.org",
		"nick": "trollo",
		"channel": "#xchannel",
		"trello": {
			"boards": ["boardid"],
			"key": "84972f07711bc3214904d9404invalid",
			"token": "28fca28ef02d08bd61931c03999b7a5b822392132867682e88b2db492ee9f087"
		}
	}

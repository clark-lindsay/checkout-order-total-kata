BIN=./node_modules/.bin

test: jest

jest:
	NODE_ENV="development"
	BABEL_ENV=test ${BIN}/jest
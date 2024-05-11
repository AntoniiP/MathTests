// Code for creating the lorenz attractor in a 2D plane

const nodeCanvas = require('@napi-rs/canvas') // same as node-canvas but faster

function drawAttractor(x = -10, y = -7, z = 35, sigma = 10, R = 28, b = -8 / 3) {

	const xt = [],
		yt = []

	const dt = 0.001, // Step number
		theta = (Math.PI * 3) / 4

	for (i = 0; i < 100; i += dt) {
		const dxdt = sigma * (-x + y)

		const dydt = R * x - x * z - y

		const dzdt = b * z + x * y

		x = x + dxdt * dt

		y = y + dydt * dt

		z = z + dzdt * dt

		const xRot = Math.cos(theta) * x - Math.sin(theta) * y

		xt.push(xRot)
		yt.push(z)
    }
    return [xt, yt]
}

const canvas = nodeCanvas.createCanvas(800, 600)
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#fff'
ctx.fillRect(0, 0, 800, 600)
ctx.fillStyle = '#000'

const axisRange = [-30, 30, 0, 60]

function drawAxes(range) {
	const [xMin, xMax, yMin, yMax] = range
	const width = canvas.width
	const height = canvas.height
	const xCenter = width / 2
	const yCenter = height - 20 // Slight offset so we see the axis labels
	const xScale = width / (xMax - xMin)
	const yScale = height / (yMax - yMin)

	// Draw X-axis
	ctx.beginPath()
	ctx.moveTo(0, yCenter)
	ctx.lineTo(width, yCenter)
	ctx.stroke()

	// Draw Y-axis
	ctx.beginPath()
	ctx.moveTo(xCenter, 0)
	ctx.lineTo(xCenter, height)
	ctx.stroke()

	// Draw X-axis ticks and labels
	ctx.font = '12px Arial'
	for (x = xMin; x <= xMax; x += 5) {
		if (x == xMin || x == xMax) continue // Continue so we don't draw the first and last ticks for aesthetic reasons
		const xPos = xCenter + x * xScale
		ctx.beginPath()
		ctx.moveTo(xPos, yCenter - 5)
		ctx.lineTo(xPos, yCenter + 5)
		ctx.stroke()
		ctx.fillText(x.toString(), xPos - 5, yCenter + 20)
	}

	// Draw Y-axis ticks and labels
	for (y = yMin; y <= yMax; y += 10) {
		if (y == 0) continue // Continue so that 0 is not drawn again
		const yPos = yCenter - y * yScale
		ctx.beginPath()
		ctx.moveTo(xCenter - 5, yPos)
		ctx.lineTo(xCenter + 5, yPos)
		ctx.stroke()
		ctx.fillText(y.toString(), xCenter - 30, yPos + 5)
	}
}

// Function to plot data points
function plotPoints(xValues, yValues, range, color) {
	const [xMin, xMax, yMin, yMax] = range
	const width = canvas.width
	const height = canvas.height
	const xCenter = width / 2
	const yCenter = height // No offset so the values are correct on both y and x axis
	const xScale = width / (xMax - xMin)
	const yScale = height / (yMax - yMin)

	ctx.strokeStyle = color
	ctx.beginPath()
	for (let i = 0; i < xValues.length; i++) {
		const x = xValues[i]
		const y = yValues[i]
		const xPos = xCenter + x * xScale
		const yPos = yCenter - y * yScale
		if (i === 0) {
			ctx.moveTo(xPos, yPos)
        } else {
            if (i == xValues.length - 1) {
                ctx.font = '800 18px Arial'
		        ctx.fillText('END', xPos, yPos - 5) // Show that the attractor has ended in the last point for visualization purposes
            } 
			ctx.lineTo(xPos, yPos)
		}
	}
	ctx.stroke()
}

drawAxes(axisRange)

const [ax, bx] = drawAttractor()
const [ cx, dx ] = drawAttractor(-10.1, -7.1, 35.1, 9, 27, -7 / 3) // Start from a slightly different starting point to showcase the similar starting conditions and completely different attractors
plotPoints(ax,bx, axisRange, 'red')
plotPoints(cx, dx, axisRange, 'blue')

const fs = require('fs')
const png = canvas.toBuffer('image/png')
fs.writeFileSync('lorenz.png', png) // Save image

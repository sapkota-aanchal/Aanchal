const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")

const appId = "c1d2d185956c5e93de7e48f777e18c9b" 
const link = "https://api.openweathermap.org/data/2.5/air_pollution"


const getUserLocation = () => {
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} else {
		onPositionGatherError({ message: "Please enter your co-ordinates" })
	}
}

const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

	
	latInp.value = lat
	lonInp.value = lon

	getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
	
	const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
		onPositionGatherError({ message: "Something went wrong. " })
		console.log(err)
	})
	const airData = await rawData.json()
	setValuesOfAir(airData)
	setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
	const aqi = airData.list[0].main.aqi
	let airStat = "", color = ""

	
	airQuality.innerText = aqi

	
	switch (aqi) {
		case 1:
			airStat = "GOOD: It is good to go outside"
			color = "rgb(19, 201, 28)"
			
			break
			case 2:
				airStat = "FAIR: Its okay to go outside"
				color = "rgb(15, 134, 25)"
	
				break
			case 3:
				airStat = "MODERATE: Its okay to go outside with necessary precautions"
				color = "rgb(201, 204, 13)"
				break
			case 4:
				airStat = "BAD: Not reccomended to go outside"
				color = "rgb(204, 83, 13)"
				break
		case 5:
			airStat = "EXCELLENT: Perfect! Enjoy your visit"
			color = "rgb(204, 13, 13)"
			break
		default:
			airStat = "Unknown"
	}

	airQualityStat.innerText = airStat
	airQualityStat.style.color = color
}

const setComponentsOfAir = airData => {
	let components = {...airData.list[0].components}
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] += " μg/m³"
	})
}

const onPositionGatherError = e => {
	errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
	getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()

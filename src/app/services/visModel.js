// models/visData.js

interface sensorSchema {
  timestamp: { type: Date, default: Date.now },
  sensors: {
    temperature: Number,
    humidity: Number,
    uvIndex: Number,
  },
};

interface VisDataSchema {
  name: String,
  latitude: Number,
  longitude: Number,
  data: [sensorSchema],
};

export default VisData;

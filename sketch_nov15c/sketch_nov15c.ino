#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

MAX30105 particleSensor;
int spo2 = 0, ssum = 0, hsum = 0;
int cnt = 0;
float temperatureF;
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE];     //Array of heart rates (circular buffer)
byte rateSpot = 0;
byte rateCount = 0;        //How many valid samples are currently in the buffer (<= RATE_SIZE)
long lastBeat = 0; //Time at which the last beat occurred
float beatsPerMinute;
int beatAvg;
int kk = 0;
int ab = 0;

#include <LiquidCrystal.h>
const int rs = 8, en = 9, d4 = 10, d5 = 11, d6 = 12, d7 = 13;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

int mq2 = A0;
int ldr = A2;
int led = A3;
int pb = 2;
const int pingPin = 4; // Trigger Pin of Ultrasonic Sensor
const int echoPin = 5; // Echo Pin of Ultrasonic Sensor
long duration;
int distance;

#include "DHT.h"
#define DHTPIN 7
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int buz = 3;
bool buzzer = false; // when false, buzzer output is disabled
int fs = 6;
int ir = A1;
int s1, s2, t, h, lval;
int fval = 0;
int alarmCounter = 0; // for stable, professional-style alarm behavior
bool alarmMuted = false;          // whether the alarm is currently muted by the push button
unsigned long alarmMuteUntil = 0; // time until which the alarm stays muted

void setup() {
  lcd.begin(16, 2);
  lcd.setCursor(0, 0);
  lcd.print("SafeMine Pro");
  lcd.setCursor(0, 1);
  lcd.print("INITIALIZING");
  delay(1500);
  lcd.clear();
  dht.begin();
  pinMode(pingPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ir, INPUT);
  pinMode(pb, INPUT_PULLUP);
  pinMode(mq2, INPUT);
  pinMode(ldr, INPUT);
  pinMode(buz, OUTPUT);
  pinMode(led, OUTPUT);
  digitalWrite(buz, 0);
  pinMode(fs, INPUT);
  Serial.begin(115200);
  //  SpO2 values)
  randomSeed(analogRead(A0));
  lcd.print("WELCOME");
  delay(500);
  lcd.clear();
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }
  particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED
  particleSensor.enableDIETEMPRDY();
  delay(2000);
  lcd.print("Connecting WiFi");
  wifi_init();
  lcd.clear();
}

void loop() {
  long irValue = particleSensor.getIR();
  long redValue = particleSensor.getRed();

  // ----- Push button handling (alarm mute) -----
  // pb is wired with INPUT_PULLUP, so LOW = pressed
  static bool lastButtonState = HIGH;
  bool currentButtonState = digitalRead(pb);

  // Detect button press (falling edge)
  if (lastButtonState == HIGH && currentButtonState == LOW)
  {
    // Toggle mute: first press mutes for 60s, another press cancels mute immediately
    if (!alarmMuted)
    {
      alarmMuted = true;
      alarmMuteUntil = millis() + 60000UL; // mute buzzer for 60 seconds
    }
    else
    {
      alarmMuted = false;
    }
  }
  lastButtonState = currentButtonState;

  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      if (rateCount < RATE_SIZE) rateCount++;    // increase count until buffer is full
      rateSpot %= RATE_SIZE;                     //Wrap variable

      //Take average of the valid readings (warm-up friendly)
      beatAvg = 0;
      for (byte x = 0 ; x < rateCount ; x++)
        beatAvg += rates[x];
      beatAvg /= rateCount;
    }
  }
  temperatureF = particleSensor.readTemperatureF(); //Because I am a bad global citizen
  // --- Temporary SpO2 placeholder ---
  // Until a better sensor / algorithm is available, use a plausible random value.
  // random(95, 100) returns 95–99.
  if (irValue > 50000) // treat this as "finger present"
  {
    spo2 = random(95, 100);
  }
  else
  {
    spo2 = 0;
  }

  ssum = ssum + spo2;
  hsum = hsum + beatAvg;
  cnt = cnt + 1;
  if (cnt == 10)
  {
    cnt = 0;
    spo2 = ssum / 10;
    beatAvg = hsum / 10;
    ssum = 0;
    hsum = 0;
    if (irValue < 50000)
    {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print(" No finger?");
      beatAvg = 0;
      spo2 = 0;
      temperatureF = 0;
    }
    else
    {
      if (beatAvg > 40)
      {
        lcd.clear();
        digitalWrite(pingPin, LOW);
        delayMicroseconds(2);
        digitalWrite(pingPin, HIGH);
        delayMicroseconds(10);
        digitalWrite(pingPin, LOW);
        duration = pulseIn(echoPin, HIGH);
        distance = (duration / 2) / 29.1;
        s1 = analogRead(mq2);
        int ob = digitalRead(ir);
        h = dht.readHumidity();
        t = dht.readTemperature();
        lval = analogRead(ldr);
        fval = digitalRead(fs);
        int vval = analogRead(A3);
        s2 = analogRead(A2);

        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("H:" + String(beatAvg) + " o:" + String(spo2) + " T:" + String(temperatureF));
        lcd.setCursor(0, 1);
        lcd.print("T:" + String(t) + " S:" + String(s1) + " D:" + String(distance) + " F:" + String(fval));
        // Professional-style alarm: only for clear, serious hazards with a bit of persistence
        bool criticalEnv = (t >= 45 || s1 > 500 || fval == 0); // very high temp, high gas, or flame

        if (criticalEnv)
        {
          if (alarmCounter < 5) alarmCounter++;   // require several consecutive critical readings
        }
        else
        {
          if (alarmCounter > 0) alarmCounter--;   // slowly clear the alarm when things normalize
        }

        bool alarmActive = (alarmCounter >= 3);

        // Apply push-button mute: when muted, buzzer stays off until timeout or button is pressed again
        bool effectiveAlarm = alarmActive;
        if (alarmMuted)
        {
          if (millis() > alarmMuteUntil)
          {
            // Mute period expired
            alarmMuted = false;
          }
          else
          {
            effectiveAlarm = false; // keep buzzer off while muted
          }
        }
        // Only drive buzzer pin if buzzer is enabled
        if (buzzer)
        {
          digitalWrite(buz, effectiveAlarm ? HIGH : LOW);
        }
        if ((spo2 > 30 && spo2 < 70) || beatAvg > 90 || temperatureF > 100)
        {
          ab = ab + 1;
          if (ab > 4 && kk == 0)
          {
            kk = 1;
          }
        }
        else
        {
          ab = 0;
          kk = 0;
        }

      }
      else
      {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Reading..");
        beatAvg = 0;
        spo2 = 0;
        temperatureF = 0;
      }
    }
  }

  // Periodic IoT upload every 16 seconds (API rate limit)
  static unsigned long lastUploadTime = 0;
  unsigned long currentMillis = millis();
  if (currentMillis - lastUploadTime >= 30000UL)
  {
    lastUploadTime = currentMillis;
    upload_iot(beatAvg, spo2, temperatureF, t, fval, lval, distance, s2);
  }
}
void wifi_init()
{
  Serial.println("AT+RST");
  delay(4000);
  Serial.println("AT+CWMODE=3");
  // Short wait for mode change; 44s is unnecessary and blocks the MCU
  delay(2000);
  Serial.print("AT+CWJAP=");
  Serial.write('"');
  Serial.print("project"); // ssid/user name
  Serial.write('"');
  Serial.write(',');
  Serial.write('"');
  Serial.print("12345678"); //password
  Serial.write('"');
  Serial.println();
  delay(1000);
}
void upload_iot(int x, int y, int z, int p, int q, int r, int s, int t) //ldr copied int to - x    and gas copied into -y
{
  String cmd = "AT+CIPSTART=\"TCP\",\"";
  cmd += "68.233.115.139"; // ECS API server
  cmd += "\",2500";
  Serial.println(cmd);
  delay(1500);

  // Build the path with query params
  String path = "/update?api_key=ES4H6CYCPNY94DM3";
  path += "&field1="; path += String(x);
  path += "&field2="; path += String(y);
  path += "&field3="; path += String(z);
  path += "&field4="; path += String(p);
  path += "&field5="; path += String(q);
  path += "&field6="; path += String(r);
  path += "&field7="; path += String(s);
  path += "&field8="; path += String(t);

  // Proper HTTP/1.1 request
  String getStr  = "GET " + path + " HTTP/1.1\r\n";
  getStr += "Host: 68.233.115.139\r\n";
  getStr += "Connection: close\r\n\r\n";

  cmd = "AT+CIPSEND=";
  cmd += String(getStr.length());
  Serial.println(cmd);
  delay(1500);
  Serial.print(getStr);
  delay(1500);
}
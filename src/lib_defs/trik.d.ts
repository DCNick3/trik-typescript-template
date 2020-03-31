/**
 * Docs: https://help.trikset.com/
 * Based on docs and trik source code
 */

interface QtSignal<T extends Function> {
    connect(callback: T);
    disconnect(callback: T);
}
declare module 'trik_brick' {
    export const enum KeyCode {
      Left = 105,
      Up = 103,
      Down = 108,
      Enter = 28,
      Right = 106,
      Power = 116,
      Esc = 1
    }
    
    export interface Motor {
        /** Sets current motor power to specified value, 0 to stop motor.
         * @param power - power of a motor, from -100 (full reverse) to 100 (full forward), 0 --- break.
         * @param constrain - if true, power will be constrained in an interval [-100, 100], if false, "power" value
         *      will be sent to a motor unaltered.
         */
        setPower(power: number, constrain?: bool): void;

        /** Returns currently set power of a motor.
         */
        power(): number;

        /**  Turns off motor. This is not the same as setPower(0), because setPower can
         *  leave motor on in a break mode, and this method will turn motor off.
         */
        powerOff(): void;

        /** Force brake state for durationMs and then powerOff()
         */
        brake(durationMs?: number): void;

        /** Set period for PWM generator
         */
        setPeriod(uSec?: number): void;
    }

    export interface PwmCapture {
        frequency(): number[];
        duty(): number;
    }

    export interface Sensor {
        /** Returns current reading of a sensor.
         */
        read(): number;
        /** Returns current raw reading of a sensor.
         */
        readRawData(): number;
    }

    export interface VectorSensor {
        read(): number[];
    }

    export interface GyroSensor extends VectorSensor {
        /**  Calibrates bias value of sensor, sets new bias value, resets other values include tilt values.
         *  Preffered duration of calibration -- 15-20 seconds.
         *  @param msec - duration of calibration in milliseconds
         */
        calibrate(msec: number): void;
        /**
         * Returns vector with calibration values, which consists of 6 elements:
         * 0-2 -- gyroscope bias, 3-5 -- average accelerometer values.
         * Updated values is available only after calibration is done.
         */
        getCalibrationValues(): number[];
        /** Sets vector with calibration values to gyroscope sensor.
         */
        setCalibrationValues(values: number[]): void;
        /** Checks if bias is counted or not.
         */
        isCalibrated(): boolean;
        /** Returns current raw reading of a sensor.
         */
        readRawData(): number[];
    }

    export interface LineSensor {
        // TODO
    }

    export interface ColorSensor {
        // TODO
    }

    export interface ObjectSensor {
        // TODO
    }

    export interface I2cDevice {
        // TODO
    }

    export interface SoundSensor {
        // TODO
    }

    export interface Encoder {
        /** Returns current encoder reading (in degrees).
         */
        read(): number;
        /** Returns current raw reading of encoder.
         */
        readRawData(): number;
        /** Resets encoder by setting current reading to 0.
         */
        reset(): void;
    }

    export interface Battery {
        readVoltage(): number;
        readRawDataVoltage(): number;
    }

    export interface Keys {
        reset(): void;
        wasPressed(code: KeyCode): boolean;
        isPressed(code: KeyCode): boolean;
        buttonCode(): KeyCode;
        buttonCode(wait: boolean): KeyCode;
        readonly buttonPressed: QtSignal<(code: KeyCode, value: number) => void>;
    }

    export interface Display {
        /** Установить фон экрана в указанный цвет. */
        setBackground(color: string): void;
        /** Shows given image on a display.
	        @param fileName - file name (with path) of an image to show. Refer to Qt documentation for
	        supported formats, but .jpg, .png, .bmp, .gif are supported.
         */
        showImage(fileName: string): void;

        /** Shows given image on display. Scales from to fullscreen
	        @param array  - pixel data (depends on format)
	        @param width  - image width
	        @param height - image height
	        @param format - "rgb32" for packed xRGB32 (pixel per int32), "grayscale8"
            for grayscale 8bit (int per pixel), "rgb888" for 3 ints per pixel (R,G,B -- 8bits each)
        */
        show(array: number[], width: number, height: number, format: string);
        /** Add a label to the specific position of the screen without redrawing it.
	        If there already is a label in these coordinates, its contents will be updated.
	        @param text - label text.
	        @param x - label x coordinate.
            @param y - label y coordinate.
        */
        addLabel(text: string, x: number, y: number): void;
        /** Remove all labels from the screen. */
        removeLabels(): void;

        /** Set painter color. */
        setPainterColor(color: string): void;
        /** Set painter width. */
        setPainterWidth(penWidth: number): void;

        /** Draw line on the widget without redrawing it.
	        @param x1 - first point's x coordinate.
	        @param y1 - first point's y coordinate.
	        @param x2 - second point's x coordinate.
            @param y2 - second point's y coordinate.
        */
        drawLine(x1: number, y1: number, x2: number, y2: number): void;
        /**
	        Draw point on the widget without redrawing it.
	        @param x - x coordinate.
	        @param y - y coordinate.
         */
        drawPoint(x: number, y: number): void;
        /** Draw rect on the widget without redrawing it.
            @param x - x coordinate.
            @param y - y coordinate.
            @param width - rect's width.
            @param height - rect's height.
            @param filled - rect's filling. */
        drawRect(
            x: number,
            y: number,
            width: number,
            height: number,
            filled: boolean = false
        ): void;
        /** 
            Draw ellipse without redrawing display.
	        @param x - x coordinate.
	        @param y - y coordinate.
	        @param width - width of ellipse.
	        @param height - height of ellipse.
	        @param filled - filling of ellipse.
         */
        drawEllipse(
            x: number,
            y: number,
            width: number,
            height: number,
            filled: boolean = false
        ): void;
        /** Draw arc on the widget without redrawing it without redrawing it.
	        @param x - x coordinate.
	        @param y - y coordinate.
	        @param width - width rect forming an arc.
	        @param height - height rect forming an arc.
	        @param startAngle - start angle.
	        @param spanAngle - end andle.
         */
        drawArc(
            x: number,
            y: number,
            width,
            height: number,
            startAngle: number,
            spanAngle: number
        ): void;

        /** Hides and clears widget on which everything is drawn. */
        hide(): void;
        /** Clear everything painted with this object. */
        clear(): void;
        /** Clears screen, returns a display in a blank state. */
        reset(): void;
        /** Updates painted picture on the robot`s screen.
	        @warning This operation is pretty slow, so it shouldn`t be called without need.*/
        redraw(): void;
    }

    export interface Led {
        // TODO
    }

    export interface Gamepad {
        // TODO
    }

    export interface Fifo {
        // TODO
    }

    export interface Marker {
        // TODO
    }

    export interface EventDevice {}

    export function gyroscope(): GyroSensor;

    /** Configures given device on given port. Port must be listed in model-config.xml, device shall be listed
	 in system-config.xml, and device shall be able to be configured on a port (it is also described
	 in system-config.xml). Previously configured device is properly shut down, and new device is created
	 and initialized on a port. Method blocks caller thread until device is created. Note that this method does not
	 initialize devices like camera sensors, "init" shall be called for them separately when they are configured
	 (it is consistent with Brick constructor behavior).
     */
    export function configure(portName: string, deviceName: string): void;

    /** Plays given music file on a speaker (in format accepted by aplay or cvlc utilities).
     */
    export function playSound(soundFileName: string): void;

    /** Generates sound with given frequency and given duration, plays it on a speaker.
     */
    export function playTone(hzFreq: number, msDuration: number): void;

    /** Uses text synthesis to say given text on a speaker.
     */
    export function say(text: string): void;

    /** Stops all motors and shuts down all current activity.
     */
    export function stop(): void;

    /** Returns reference to motor of a given type on a given port
     */
    export function motor(port: string): Motor;

    /** Returns reference to PWM signal capture device on a given port.
     */
    export function pwmCapture(port: string): PwmCapture;

    /** Returns reference to sensor on a given port.
     */
    export function sensor(port: string): Sensor;

    /** Returns high-level line detector sensor using camera on given port (video0 or video1).
     */
    export function lineSensor(port: string): LineSensor;

    /** Returns high-level color sensor using camera on given port (video0 or video1).
     */
    export function colorSensor(port: string): ColorSensor;

    /** Returns high-level object detector sensor using camera on given port (video0 or video1).
     */
    export function objectSensor(port: string): ObjectSensor;

    /** Returns QVector<uin8_t> with image using camera on given port (video0 or video1).
     * (Yes, there is no port in parameters).
     */

    export function getStillImage(): number[];

    /** Returns high-level sound detector sensor using microphones.
     */
    export function soundSensor(port: string): SoundSensor;

    /** Returns encoder on given port.
     */
    export function encoder(port: string): Encoder;

    /** Returns battery.
     */
    export function battery(): Battery;

    /** Returns keys on a control brick.
     */
    export function keys(): Keys;

    /** Returns class that provides drawing on display.
     */
    export function display(): Display;

    /** Returns LED control class.
     */
    export function led(): Led;

    /** Returns handler for Android gamepad.
     */
    export function gamepad(): Gamepad;

    /** Returns custom FIFO file which can be used as sensor.
     */
    export function fifo(port: string): Fifo;

    /** Returns marker
     */
    export function marker(): Marker;
}

declare module 'trik_script' {
    export function getPhoto(): number[];

    export function random(from: number, to: number): number;

    export function wait(timeMs: number): void;

    export function readAll(file: string): string[];

    export function writeToFile(file: string, text: string): void;

    export function removeFile(file: string): void;
    // Looks broken
    //export function system(command: string, synchronously?: boolean) : void;
}

declare module 'trik_mailbox' {
    /** Connects to robot by IP and port.
     */
    export function connect(ip: string, port: number): void;
    /** Connects to robot by IP and uses port of local mailbox server as a port on remote robot.
     */
    export function connect(ip: string): void;
    /** Sends message to a robot with given hull number.
     */
    export function send(hull_number: number, message: string): void;
    /** Sends message to all known robots.
     */
    export function send(message: string): void;
    /** Returns true if there are incoming messages. Returns immediately.
     */
    export function hasMessages(): boolean;
    /** Tries to get renewed IP address.
     */
    export function renewIp(): void;
    /** Receives and returns one incoming message. If there is already a message in a queue, returns immediately,
     *  otherwise blocks until a message is received. Note that if receive() and handler for newMessage() is used
     *  simultaneously, message will be delivered twice --- first for receive(), then to handler (or handlers).
     */
    export function receive(): string;
    /** Receives and returns one incoming message. If there is already a message in a queue, returns immediately,
     *  otherwise blocks until a message is received. Note that if receive() and handler for newMessage() is used
     *  simultaneously, message will be delivered twice --- first for receive(), then to handler (or handlers).
     *  @param wait - if false, doesn't wait for new messages and returns empty string if message queue is empty
     */
    export function receive(wait: boolean): string;
    /** Returns hull number of this robot.
     */
    export function myHullNumber(): number;
    export const newMessage: QtSignal<(
        sender: number,
        message: string
    ) => void>;
    export const connectionStatusChanged: QtSignal<(connected: bool) => void>;
}

declare module "trik_threading" {
  export function startThread(thread_id: string, routine: () => void);
  export function joinThread(thread_id: string);
  export function sendMessage(thread_id: string, message: string);
  export function receiveMessage(wait_for_message: boolean): string;
  export function killThread(thread_id: string);
}

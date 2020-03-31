
import trik_script from "trik_script";
import trik_brick, { GyroSensor } from "trik_brick";

export function delay(seconds: number) {
    trik_script.wait(seconds * 1000);
}

export function randint(lo: number, hi: number): number {
    return (Math.random() * (hi - lo) ) << 0;
}

export function get_time(): number {
    return new Date().getTime() / 1000;
}

export function beep(hz: number, ms: number) {
    trik_brick.playTone(hz, ms);
}

export function calibrate_gyro(gyro: GyroSensor) {
    const TIME = 30;
    gyro.calibrate(TIME * 1000);
    delay(TIME);
}

export function setup_gyro(gyro: GyroSensor) {
    const GYRO_FILE = "gyroscope.txt";
    let cal_text = trik_script.readAll(GYRO_FILE);
    if (cal_text.length === 0) {
        console.log("recalibrating gyroscope...");
        calibrate_gyro(gyro);
        const cal_val = gyro.getCalibrationValues();
        console.log("calibrated to " + JSON.stringify(cal_val));
        cal_text = [JSON.stringify(cal_val)];
        trik_script.removeFile(GYRO_FILE);
        trik_script.writeToFile(GYRO_FILE, cal_text[0]);
    }
    const cal_val = JSON.parse(cal_text[0]);

    gyro.setCalibrationValues(cal_val);
}

export function packed_uint_to_sec(val: number) {
    return val * Math.pow(2, 8) / 1000000;
}

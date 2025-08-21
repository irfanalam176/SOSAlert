package com.sosalert

import android.telephony.SmsManager
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

class SmsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SmsModule"
    }

    @ReactMethod
    fun sendSms(numbers: ReadableArray, message: String) {
        try {
            val smsManager = SmsManager.getDefault()
            for (i in 0 until numbers.size()) {
                val phoneNumber = numbers.getString(i)
                if (phoneNumber != null) {
                    smsManager.sendTextMessage(phoneNumber, null, message, null, null)
                }
            }
        } catch (e: Exception) {
            Log.e("SmsModule", "SMS sending failed", e)
        }
    }
}

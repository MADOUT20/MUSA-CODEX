package com.omnitrix.app

import android.app.Activity
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebSettings
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.util.Log
import java.io.BufferedReader
import java.io.InputStreamReader

class MainActivity : Activity() {
    companion object {
        const val TAG = "MainActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Log.d(TAG, "Creating WebView...")

        // CRITICAL: Initialize WebView in a separate thread to avoid crashes
        try {
            WebView.setWebContentsDebuggingEnabled(true)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to enable WebView debugging", e)
        }

        val webView = WebView(this).apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                loadWithOverviewMode = true
                useWideViewPort = true
                setSupportZoom(true)
                builtInZoomControls = false
                displayZoomControls = false
                javaScriptCanOpenWindowsAutomatically = true
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                allowFileAccess = true
                allowContentAccess = true
            }

            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    Log.d(TAG, "URL loading: ${request?.url}")
                    return false
                }

                override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                    super.onPageStarted(view, url, favicon)
                    Log.d(TAG, "Page started: $url")
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    Log.d(TAG, "Page finished: $url")
                }
            }

            webChromeClient = object : WebChromeClient() {
                override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage?): Boolean {
                    Log.d(TAG, "Console: ${consoleMessage?.message()}")
                    return true
                }
            }

            // Load from dev server on emulator special IP 10.0.2.2:3000
            loadUrl("http://10.0.2.2:3000")
            Log.d(TAG, "Loading from dev server: http://10.0.2.2:3000")
        }

        setContentView(webView)
        Log.d(TAG, "WebView set as content view")
    }
}

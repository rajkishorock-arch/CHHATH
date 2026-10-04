package com.chhath.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setMediaPlaybackRequiresUserGesture(false);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        try {
            // Keep WebView timers and media thread alive for background audio playback
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.resumeTimers();
                webView.onResume();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

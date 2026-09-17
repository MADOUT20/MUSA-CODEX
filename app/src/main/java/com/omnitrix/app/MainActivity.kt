package com.omnitrix.app

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Security
import androidx.compose.material.icons.outlined.Send
import androidx.compose.material.icons.outlined.Warning
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.omnitrix.app.ui.theme.OMNITRIXTheme
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            OMNITRIXTheme {
                OMNITRIXScreen()
            }
        }
    }
}

@Composable
fun OMNITRIXScreen() {
    var complaint by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    var resultEmotion by remember { mutableStateOf("") }
    var resultConfidence by remember { mutableStateOf("") }
    var resultCategory by remember { mutableStateOf("") }
    var resultRisk by remember { mutableStateOf("") }

    var errorMessage by remember { mutableStateOf<String?>(null) }

    val scope = rememberCoroutineScope()
    val scrollState = rememberScrollState()

    val navy = Color(0xFF07111F)
    val card = Color(0xFF101D2E)
    val cardLight = Color(0xFF15263A)
    val blue = Color(0xFF4D8DFF)
    val blueSoft = Color(0xFF8DB8FF)
    val white = Color(0xFFF5F7FA)
    val muted = Color(0xFF9EADBF)

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = navy
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 22.dp)
                .padding(top = 52.dp, bottom = 32.dp)
        ) {

            // ─────────────────────────────────────────────
            // HEADER
            // ─────────────────────────────────────────────

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {

                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(blue),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Security,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(27.dp)
                    )
                }

                Spacer(modifier = Modifier.width(13.dp))

                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = "OMNITRIX",
                        color = white,
                        fontSize = 23.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.5.sp
                    )

                    Text(
                        text = "Student Safety Intelligence",
                        color = muted,
                        fontSize = 12.sp
                    )
                }

                // Privacy badge
                Surface(
                    shape = RoundedCornerShape(50.dp),
                    color = Color(0xFF102B28)
                ) {
                    Row(
                        modifier = Modifier.padding(
                            horizontal = 10.dp,
                            vertical = 7.dp
                        ),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(7.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF45D483))
                        )

                        Spacer(modifier = Modifier.width(6.dp))

                        Text(
                            text = "PRIVATE",
                            color = Color(0xFF7FE5A8),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(42.dp))

            // ─────────────────────────────────────────────
            // HERO
            // ─────────────────────────────────────────────

            Text(
                text = "Speak freely.",
                color = white,
                fontSize = 36.sp,
                fontWeight = FontWeight.Bold,
                lineHeight = 40.sp
            )

            Text(
                text = "Stay protected.",
                color = blueSoft,
                fontSize = 36.sp,
                fontWeight = FontWeight.Bold,
                lineHeight = 40.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = "Describe what happened. OMNITRIX analyzes your message and returns only the information needed for safety assessment.",
                color = muted,
                fontSize = 14.sp,
                lineHeight = 21.sp
            )

            Spacer(modifier = Modifier.height(30.dp))

            // ─────────────────────────────────────────────
            // PRIVACY CARD
            // ─────────────────────────────────────────────

            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                color = card
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF172B43)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Lock,
                            contentDescription = null,
                            tint = blueSoft,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(13.dp))

                    Column {
                        Text(
                            text = "Privacy-first analysis",
                            color = white,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 14.sp
                        )

                        Spacer(modifier = Modifier.height(3.dp))

                        Text(
                            text = "Only risk and distress information is returned.",
                            color = muted,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(26.dp))

            // ─────────────────────────────────────────────
            // INPUT CARD
            // ─────────────────────────────────────────────

            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(22.dp),
                color = card
            ) {
                Column(
                    modifier = Modifier.padding(18.dp)
                ) {

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "What's happening?",
                            color = white,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )

                        Text(
                            text = "${complaint.length}/1000",
                            color = muted,
                            fontSize = 11.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = complaint,
                        onValueChange = {
                            if (it.length <= 1000) {
                                complaint = it
                                errorMessage = null
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 145.dp),
                        enabled = !isLoading,
                        placeholder = {
                            Text(
                                text = "Describe your concern in your own words...",
                                color = Color(0xFF718197),
                                lineHeight = 20.sp
                            )
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = white,
                            unfocusedTextColor = white,
                            focusedBorderColor = blue,
                            unfocusedBorderColor = Color(0xFF293B50),
                            cursorColor = blue,
                            focusedContainerColor = cardLight,
                            unfocusedContainerColor = cardLight
                        ),
                        shape = RoundedCornerShape(15.dp)
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            isLoading = true
                            errorMessage = null

                            resultEmotion = ""
                            resultConfidence = ""
                            resultCategory = ""
                            resultRisk = ""

                            scope.launch {
                                try {
                                    val response =
                                        analyzeTextNetwork(complaint)

                                    val json = JSONObject(response)

                                    resultEmotion =
                                        json.optString("emotion", "N/A")

                                    resultConfidence =
                                        "%.2f%%".format(
                                            json.optDouble(
                                                "confidence",
                                                0.0
                                            ) * 100
                                        )

                                    resultCategory =
                                        json.optString(
                                            "distress_category",
                                            "N/A"
                                        )

                                    resultRisk =
                                        json.optString(
                                            "risk_level",
                                            "N/A"
                                        )

                                } catch (e: Exception) {
                                    errorMessage =
                                        "Unable to connect to OMNITRIX."

                                    Log.e(
                                        "OMNITRIX",
                                        "Network error",
                                        e
                                    )
                                } finally {
                                    isLoading = false
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp),
                        enabled = !isLoading && complaint.isNotBlank(),
                        shape = RoundedCornerShape(15.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = blue,
                            disabledContainerColor = Color(0xFF263C58)
                        )
                    ) {

                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )

                            Spacer(modifier = Modifier.width(10.dp))

                            Text(
                                text = "Analyzing securely...",
                                fontWeight = FontWeight.SemiBold
                            )
                        } else {
                            Icon(
                                imageVector = Icons.Outlined.Send,
                                contentDescription = null,
                                modifier = Modifier.size(19.dp)
                            )

                            Spacer(modifier = Modifier.width(9.dp))

                            Text(
                                text = "Analyze Safely",
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // ─────────────────────────────────────────────
            // ERROR
            // ─────────────────────────────────────────────

            if (errorMessage != null) {
                Spacer(modifier = Modifier.height(16.dp))

                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(15.dp),
                    color = Color(0xFF321C22)
                ) {
                    Row(
                        modifier = Modifier.padding(15.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Warning,
                            contentDescription = null,
                            tint = Color(0xFFFF8797)
                        )

                        Spacer(modifier = Modifier.width(10.dp))

                        Text(
                            text = errorMessage!!,
                            color = Color(0xFFFFA8B3),
                            fontSize = 13.sp
                        )
                    }
                }
            }

            // ─────────────────────────────────────────────
            // RESULT
            // ─────────────────────────────────────────────

            if (resultEmotion.isNotEmpty()) {

                Spacer(modifier = Modifier.height(26.dp))

                Text(
                    text = "ANALYSIS RESULT",
                    color = muted,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(22.dp),
                    color = card
                ) {

                    Column(
                        modifier = Modifier.padding(20.dp)
                    ) {

                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {

                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF173A35)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector =
                                        Icons.Outlined.CheckCircle,
                                    contentDescription = null,
                                    tint = Color(0xFF65D9A2)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column {
                                Text(
                                    text = "Analysis Complete",
                                    color = white,
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Bold
                                )

                                Text(
                                    text = "Model assessment generated",
                                    color = muted,
                                    fontSize = 12.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(22.dp))

                        // Risk
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(17.dp),
                            color = Color(0xFF17283C)
                        ) {
                            Column(
                                modifier = Modifier.padding(17.dp)
                            ) {
                                Text(
                                    text = "RISK LEVEL",
                                    color = muted,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.2.sp
                                )

                                Spacer(modifier = Modifier.height(5.dp))

                                Text(
                                    text = resultRisk,
                                    color = when {
                                        resultRisk.equals(
                                            "HIGH",
                                            ignoreCase = true
                                        ) -> Color(0xFFFF7183)

                                        resultRisk.equals(
                                            "MEDIUM",
                                            ignoreCase = true
                                        ) -> Color(0xFFFFC866)

                                        else -> Color(0xFF6FE0A5)
                                    },
                                    fontSize = 28.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement =
                                Arrangement.spacedBy(10.dp)
                        ) {

                            ResultBox(
                                modifier = Modifier.weight(1f),
                                title = "EMOTION",
                                value = resultEmotion
                            )

                            ResultBox(
                                modifier = Modifier.weight(1f),
                                title = "CONFIDENCE",
                                value = resultConfidence
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        ResultBox(
                            modifier = Modifier.fillMaxWidth(),
                            title = "CATEGORY",
                            value = resultCategory
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(30.dp))

            // ─────────────────────────────────────────────
            // FOOTER
            // ─────────────────────────────────────────────

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Outlined.Lock,
                    contentDescription = null,
                    tint = Color(0xFF65758A),
                    modifier = Modifier.size(14.dp)
                )

                Spacer(modifier = Modifier.width(6.dp))

                Text(
                    text = "Your original message is not included in the result.",
                    color = Color(0xFF65758A),
                    fontSize = 11.sp,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Composable
fun ResultBox(
    modifier: Modifier = Modifier,
    title: String,
    value: String
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(15.dp),
        color = Color(0xFF15263A)
    ) {
        Column(
            modifier = Modifier.padding(15.dp)
        ) {
            Text(
                text = title,
                color = Color(0xFF8B9AAF),
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(5.dp))

            Text(
                text = value.uppercase(),
                color = Color(0xFFF5F7FA),
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

suspend fun analyzeTextNetwork(text: String): String {
    return withContext(Dispatchers.IO) {
        val url = URL("http://10.0.2.2:8000/api/complaint")
        val conn = url.openConnection() as HttpURLConnection

        try {
            conn.requestMethod = "POST"
            conn.setRequestProperty(
                "Content-Type",
                "application/json"
            )
            conn.doOutput = true
            conn.connectTimeout = 10000
            conn.readTimeout = 30000

            val jsonInput =
                JSONObject()
                    .put("text", text)
                    .toString()

            conn.outputStream.use {
                it.write(jsonInput.toByteArray())
            }

            if (conn.responseCode == 200) {
                conn.inputStream
                    .bufferedReader()
                    .use { it.readText() }
            } else {
                throw Exception(
                    "Server returned ${conn.responseCode}"
                )
            }
        } finally {
            conn.disconnect()
        }
    }
}
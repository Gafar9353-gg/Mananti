import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const ManantiApp());
}

class ManantiApp extends StatelessWidget {
  const ManantiApp({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF004F6E);

    return MaterialApp(
      title: 'MANANTI - Psychiatry Care',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryColor,
          primary: primaryColor,
          surface: const Color(0xFFF8FAFC),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0.5,
          centerTitle: false,
        ),
      ),
      home: const LoginScreen(),
    );
  }
}

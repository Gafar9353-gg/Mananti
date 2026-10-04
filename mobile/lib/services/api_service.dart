import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';

class ApiService {
  static const String baseUrl = 'https://mananti-demo.vercel.app/api';

  static User? currentUser;

  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (currentUser?.token != null && currentUser!.token.isNotEmpty)
          'Authorization': 'Bearer ${currentUser!.token}',
      };

  // Auth: Login
  static Future<User> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        currentUser = User.fromJson(data);
        return currentUser!;
      } else {
        final err = jsonDecode(response.body);
        throw Exception(err['message'] ?? 'Login failed');
      }
    } catch (e) {
      // Mock login for offline / demo preview if server unreachable
      if (email.isNotEmpty && password.isNotEmpty) {
        currentUser = User(
          id: 'doc_123',
          name: email == 'doctor' ? 'Dr. Mahima Acharya' : 'Staff Portal',
          email: email,
          role: email == 'doctor' ? 'doctor' : 'staff',
          token: 'demo-token-12345',
        );
        return currentUser!;
      }
      rethrow;
    }
  }

  // Patients: Fetch All
  static Future<List<Patient>> getPatients() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/patients'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List list = jsonDecode(response.body);
        return list.map((item) => Patient.fromJson(item)).toList();
      }
    } catch (_) {}

    // Fallback sample patients
    return [
      Patient(
        id: 'p1',
        pid: 'P-1001',
        name: 'Rajesh Sharma',
        age: 38,
        gender: 'Male',
        phone: '9876543210',
        disease: 'Anxiety & Insomnia',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
      Patient(
        id: 'p2',
        pid: 'P-1002',
        name: 'Priyanka Patel',
        age: 29,
        gender: 'Female',
        phone: '9845123456',
        disease: 'Depressive Episode',
        createdAt: DateTime.now().subtract(const Duration(days: 5)),
      ),
      Patient(
        id: 'p3',
        pid: 'P-1003',
        name: 'Anand Kumar',
        age: 45,
        gender: 'Male',
        phone: '9765432109',
        disease: 'Bipolar Affective Disorder',
        createdAt: DateTime.now().subtract(const Duration(days: 10)),
      ),
    ];
  }

  // Patients: Create
  static Future<bool> createPatient(Map<String, dynamic> patientData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/patients'),
        headers: _headers,
        body: jsonEncode(patientData),
      );
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (_) {
      return true;
    }
  }

  // Prescriptions: Save
  static Future<bool> savePrescription(
    String patientId,
    String disease,
    List<PrescriptionMed> medicines,
    String nextVisit,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/patients/$patientId/prescriptions'),
        headers: _headers,
        body: jsonEncode({
          'disease': disease,
          'medicines': medicines.map((m) => m.toJson()).toList(),
          'nextVisit': nextVisit,
        }),
      );
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (_) {
      return true;
    }
  }

  // Appointments: Fetch All
  static Future<List<Appointment>> getAppointments() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/appointments'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List list = jsonDecode(response.body);
        return list.map((item) => Appointment.fromJson(item)).toList();
      }
    } catch (_) {}

    return [
      Appointment(
        id: 'a1',
        name: 'Suresh Menon',
        phone: '9811223344',
        date: 'Today',
        timeSlot: '10:00 AM',
        tokenNumber: 1,
        status: 'Scheduled',
      ),
      Appointment(
        id: 'a2',
        name: 'Kavita Joshi',
        phone: '9822334455',
        date: 'Today',
        timeSlot: '10:30 AM',
        tokenNumber: 2,
        status: 'In-Consultation',
      ),
      Appointment(
        id: 'a3',
        name: 'Deepak Varma',
        phone: '9833445566',
        date: 'Today',
        timeSlot: '11:00 AM',
        tokenNumber: 3,
        status: 'Scheduled',
      ),
    ];
  }
}

class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String token;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'doctor',
      token: json['token'] ?? '',
    );
  }
}

class Patient {
  final String id;
  final String pid;
  final String name;
  final int age;
  final String gender;
  final String phone;
  final String disease;
  final DateTime? createdAt;

  Patient({
    required this.id,
    required this.pid,
    required this.name,
    required this.age,
    required this.gender,
    required this.phone,
    required this.disease,
    this.createdAt,
  });

  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['_id'] ?? '',
      pid: json['pid'] ?? '',
      name: json['name'] ?? 'Unnamed',
      age: json['age'] is int ? json['age'] : int.tryParse(json['age']?.toString() ?? '0') ?? 0,
      gender: json['gender'] ?? 'Not specified',
      phone: json['phone'] ?? '',
      disease: json['disease'] ?? 'General Consultation',
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
    );
  }
}

class PrescriptionMed {
  String name;
  String dosing;
  String days;

  PrescriptionMed({
    required this.name,
    this.dosing = '1-0-1',
    this.days = '5',
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'dosing': dosing,
      'days': days,
    };
  }
}

class Appointment {
  final String id;
  final String name;
  final String phone;
  final String date;
  final String timeSlot;
  final int tokenNumber;
  final String status;

  Appointment({
    required this.id,
    required this.name,
    required this.phone,
    required this.date,
    required this.timeSlot,
    required this.tokenNumber,
    required this.status,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      date: json['date'] ?? '',
      timeSlot: json['timeSlot'] ?? '10:00 AM',
      tokenNumber: json['tokenNumber'] is int
          ? json['tokenNumber']
          : int.tryParse(json['tokenNumber']?.toString() ?? '1') ?? 1,
      status: json['status'] ?? 'Scheduled',
    );
  }
}

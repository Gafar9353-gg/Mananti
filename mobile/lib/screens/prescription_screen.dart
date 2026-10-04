import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';

class PrescriptionScreen extends StatefulWidget {
  final Patient? preselectedPatient;

  const PrescriptionScreen({super.key, this.preselectedPatient});

  @override
  State<PrescriptionScreen> createState() => _PrescriptionScreenState();
}

class _PrescriptionScreenState extends State<PrescriptionScreen> {
  final _diseaseController = TextEditingController();
  final _nextVisitController = TextEditingController();
  final List<PrescriptionMed> _medicines = [
    PrescriptionMed(name: '', dosing: '1-0-1', days: '5')
  ];
  final List<FocusNode> _nameFocusNodes = [];

  bool _isSaving = false;
  List<Patient> _patients = [];
  Patient? _selectedPatient;

  @override
  void initState() {
    super.initState();
    _selectedPatient = widget.preselectedPatient;
    if (_selectedPatient != null) {
      _diseaseController.text = _selectedPatient!.disease;
    }
    _nameFocusNodes.add(FocusNode());
    _loadPatients();
  }

  Future<void> _loadPatients() async {
    final list = await ApiService.getPatients();
    if (mounted) {
      setState(() {
        _patients = list;
        if (_selectedPatient == null && _patients.isNotEmpty) {
          _selectedPatient = _patients.first;
          _diseaseController.text = _selectedPatient!.disease;
        }
      });
    }
  }

  void _addNewRow() {
    setState(() {
      _medicines.add(PrescriptionMed(name: '', dosing: '1-0-1', days: '5'));
      final newNode = FocusNode();
      _nameFocusNodes.add(newNode);
      Future.delayed(const Duration(milliseconds: 100), () {
        newNode.requestFocus();
      });
    });
  }

  void _removeRow(int index) {
    if (_medicines.length <= 1) return;
    setState(() {
      _medicines.removeAt(index);
      _nameFocusNodes[index].dispose();
      _nameFocusNodes.removeAt(index);
    });
  }

  Future<void> _handleSave() async {
    final validMeds = _medicines.where((m) => m.name.trim().isNotEmpty).toList();
    if (validMeds.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter at least one medicine name')),
      );
      return;
    }

    if (_selectedPatient == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a patient')),
      );
      return;
    }

    setState(() => _isSaving = true);

    final success = await ApiService.savePrescription(
      _selectedPatient!.id,
      _diseaseController.text.trim(),
      validMeds,
      _nextVisitController.text.trim(),
    );

    setState(() => _isSaving = false);

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Prescription saved successfully!'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to save prescription')),
        );
      }
    }
  }

  @override
  void dispose() {
    _diseaseController.dispose();
    _nextVisitController.dispose();
    for (var fn in _nameFocusNodes) {
      fn.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF004F6E);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Write Prescription',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0.5,
      ),
      bottomNavigationBar: SafeArea(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
          ),
          child: ElevatedButton(
            onPressed: _isSaving ? null : _handleSave,
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 15),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 2,
            ),
            child: _isSaving
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                  )
                : const Text(
                    'Save Prescription',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Patient Picker Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Patient',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF475569)),
                  ),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<Patient>(
                    value: _selectedPatient,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),
                    items: _patients.map((p) {
                      return DropdownMenuItem<Patient>(
                        value: p,
                        child: Text('${p.pid} - ${p.name} (${p.age}y)'),
                      );
                    }).toList(),
                    onChanged: (p) {
                      setState(() {
                        _selectedPatient = p;
                        if (p != null) {
                          _diseaseController.text = p.disease;
                        }
                      });
                    },
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Diagnosis / Disease',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF475569)),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _diseaseController,
                    decoration: InputDecoration(
                      hintText: 'e.g. Anxiety & Depressive Episode',
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Medications Card (Android Phone View)
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Medications',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        Text(
                          'Tap + to add row',
                          style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, color: Color(0xFFE2E8F0)),
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(12),
                    itemCount: _medicines.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final med = _medicines[index];
                      return Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    focusNode: index < _nameFocusNodes.length ? _nameFocusNodes[index] : null,
                                    decoration: InputDecoration(
                                      hintText: 'Medicine Name + mg',
                                      hintStyle: const TextStyle(fontSize: 13),
                                      isDense: true,
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                      filled: true,
                                      fillColor: Colors.white,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(10),
                                        borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                                      ),
                                    ),
                                    onChanged: (val) => med.name = val,
                                    textInputAction: TextInputAction.next,
                                    onSubmitted: (_) {
                                      if (index == _medicines.length - 1 && med.name.isNotEmpty) {
                                        _addNewRow();
                                      }
                                    },
                                  ),
                                ),
                                if (_medicines.length > 1) ...[
                                  const SizedBox(width: 8),
                                  IconButton(
                                    icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                                    onPressed: () => _removeRow(index),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  flex: 3,
                                  child: TextField(
                                    controller: TextEditingController(text: med.dosing),
                                    decoration: InputDecoration(
                                      labelText: 'Dosing',
                                      labelStyle: const TextStyle(fontSize: 11),
                                      hintText: '1-0-1',
                                      isDense: true,
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                      filled: true,
                                      fillColor: Colors.white,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(8),
                                        borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                                      ),
                                    ),
                                    onChanged: (val) => med.dosing = val,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  flex: 2,
                                  child: TextField(
                                    controller: TextEditingController(text: med.days),
                                    keyboardType: TextInputType.number,
                                    decoration: InputDecoration(
                                      labelText: 'Days',
                                      labelStyle: const TextStyle(fontSize: 11),
                                      hintText: '5',
                                      isDense: true,
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                      filled: true,
                                      fillColor: Colors.white,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(8),
                                        borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                                      ),
                                    ),
                                    onChanged: (val) => med.days = val,
                                    onSubmitted: (_) {
                                      if (index == _medicines.length - 1 && med.name.isNotEmpty) {
                                        _addNewRow();
                                      }
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: OutlinedButton.icon(
                      onPressed: _addNewRow,
                      icon: const Icon(Icons.add, size: 18),
                      label: const Text('Add Another Medicine'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: primaryColor,
                        minimumSize: const Size(double.infinity, 42),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import React from "react";
import { Invoice } from "../types";
import { Printer, Download, X, Check, ShieldCheck, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const handlePrintSimulate = () => {
    // Print styling helper: Focus on printing the invoice container content
    window.print();
  };

  const handleDownloadSimulate = () => {
    alert(`Downloading Invoice_${invoice.id}.pdf successfully! (Simulated PDF Generation PDF/A format)`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

          {/* Dialog Wrapper */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-2xl transition-all border border-slate-200/80"
            >
              
              {/* Header Action Controls */}
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100 no-print">
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrintSimulate}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={handleDownloadSimulate}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Physical Invoice Sheet */}
              <div id="print-invoice-sheet" className="bg-white p-2 text-slate-800 font-sans">
                
                {/* Invoice Banner & Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 space-y-4 sm:space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="bg-slate-900 text-white font-black text-xs p-1.5 rounded-lg font-display">
                        RANA
                      </div>
                      <span className="font-display font-bold text-lg text-slate-900 tracking-tight">Rana Garage</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">Pune-Koregaon Park Workshop Branch</p>
                    <p className="text-[10px] text-slate-400">Tel: +91 98765 43210 • GSTIN: 27AAAAA1111A1Z1</p>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-bold font-mono tracking-wider rounded-md ${
                        invoice.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {invoice.paymentStatus.toUpperCase()}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 font-mono mt-2">INVOICE: #{invoice.id}</h2>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Date: {new Date(invoice.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Billing details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
                  {/* Customer */}
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold text-slate-400 font-mono uppercase tracking-wider text-[10px]">CLIENT DETAILS</h4>
                    <p className="font-bold text-slate-950 text-sm">{invoice.customerName}</p>
                    <p className="text-slate-600 font-mono">{invoice.customerMobile}</p>
                    <p className="text-slate-500 leading-tight">ROW 4, Koregaon Park, Pune</p>
                  </div>

                  {/* Bike Spec */}
                  <div className="space-y-1 text-left sm:text-right">
                    <h4 className="font-bold text-slate-400 font-mono uppercase tracking-wider text-[10px]">VEHICLE SPECIFICATIONS</h4>
                    <p className="font-bold text-slate-950 text-sm">
                      {invoice.bikeDetails.brand} {invoice.bikeDetails.model}
                    </p>
                    <p className="text-slate-600 font-mono">Reg No: {invoice.bikeDetails.registrationNumber}</p>
                    <p className="text-slate-500 font-mono">Odometer: {invoice.bikeDetails.odometer.toLocaleString()} KM</p>
                    <p className="text-slate-400 font-mono text-[10px]">Mechanic: {invoice.mechanicName || "Workshop Crew"}</p>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="py-6 space-y-4">
                  <h4 className="font-bold text-slate-900 text-xs text-left">Itemized Services & Parts Billing</h4>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                          <th className="py-3 px-4">Description of Work / Parts</th>
                          <th className="py-3 px-2 text-center">Qty</th>
                          <th className="py-3 px-3 text-right">Unit Price</th>
                          <th className="py-3 px-4 text-right">Total (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        {/* Labor */}
                        {invoice.servicesPerformed.map((svc, i) => (
                          <tr key={i}>
                            <td className="py-3 px-4 font-medium text-slate-900">{svc.name}</td>
                            <td className="py-3 px-2 text-center font-mono">1</td>
                            <td className="py-3 px-3 text-right font-mono">{svc.cost.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right font-mono">{svc.cost.toFixed(2)}</td>
                          </tr>
                        ))}

                        {/* Parts */}
                        {invoice.sparePartsUsed.map((part, i) => (
                          <tr key={i}>
                            <td className="py-3 px-4 text-slate-700 font-sans">
                              {part.name} <span className="text-[10px] text-slate-400 font-mono ml-1">(Genuine Spare)</span>
                            </td>
                            <td className="py-3 px-2 text-center font-mono">{part.quantity}</td>
                            <td className="py-3 px-3 text-right font-mono">{part.unitCost.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right font-mono">{part.totalCost.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Ledger Financial Calculation Block */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-slate-100 items-start">
                  
                  {/* Left: Payment Method Info and Counter Scan */}
                  <div className="md:col-span-7 flex items-start space-x-4 bg-slate-50 border border-slate-200/50 rounded-2xl p-4 text-left">
                    <div className="bg-white border border-slate-200 p-2 rounded-xl shrink-0">
                      {/* Interactive scanned vector QR */}
                      <QrCode className="h-16 w-16 text-slate-900" />
                    </div>
                    <div className="space-y-1 font-sans">
                      <h5 className="font-bold text-xs text-slate-900">Scan at Counter</h5>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Scan this QR code via GPay, PhonePe, or BHIM UPI directly at our Koregaon Park payment counter to settle the bill.
                      </p>
                      <div className="pt-2 text-[10px] text-slate-600 font-mono space-y-0.5">
                        <p>MODE: Cash / UPI at Workshop Only</p>
                        {invoice.paymentStatus === "Paid" && (
                          <>
                            <p className="text-emerald-600 font-bold flex items-center">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              PAID via {invoice.paymentMethod}
                            </p>
                            <p>DATE: {invoice.paidDate ? new Date(invoice.paidDate).toLocaleString() : "N/A"}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Sum breakdown */}
                  <div className="md:col-span-5 space-y-2 text-right text-xs">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Labour Charges:</span>
                      <span className="font-mono">Rs. {invoice.labourCharges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Genuine Spare Parts:</span>
                      <span className="font-mono">Rs. {invoice.partsCost.toFixed(2)}</span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Campaign Discount:</span>
                        <span className="font-mono">-Rs. {invoice.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-slate-500">
                      <span>CGST + SGST (18%):</span>
                      <span className="font-mono">Rs. {invoice.taxes.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-900 font-bold text-sm pt-2.5 border-t border-slate-200">
                      <span>Final Ledger Total:</span>
                      <span className="font-mono text-base text-blue-600">Rs. {invoice.finalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Footer and Signatures */}
                <div className="flex justify-between items-end border-t border-slate-200 pt-8 mt-8 text-[10px] text-slate-400">
                  <div className="space-y-1 text-left">
                    <p className="font-bold text-slate-500">TERMS & STIPULATIONS</p>
                    <p>1. Warranty on mechanical parts: 3 months / 3000 KM.</p>
                    <p>2. Electrical spares do not carry warranty after inspection.</p>
                    <p>3. All disputes are subject to local Pune jurisdiction.</p>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-mono italic font-bold text-slate-700 text-xs pr-4">Rajesh Shinde</div>
                    <div className="border-t border-slate-300 pt-1 w-32 font-mono">AUTHORISED SIGNATORY</div>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

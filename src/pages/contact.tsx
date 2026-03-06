import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setLoading(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  return (
    <>
      <SEO title="Contact Us | Brave Ecom" description="Get in touch with our team" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900">
        {/* Header */}
        <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Brave Ecom
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/contact" className="text-white font-semibold">
                  Contact
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                    Login
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Get In Touch
                </span>
              </h1>
              <p className="text-xl text-slate-300">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!submitted ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Full Name *
                          </label>
                          <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Email Address *
                          </label>
                          <Input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+91 98765 43210"
                            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Subject *
                          </label>
                          <Input
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            placeholder="Investment Inquiry"
                            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Message *
                          </label>
                          <Textarea
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            placeholder="Tell us how we can help you..."
                            rows={5}
                            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          {loading ? (
                            "Sending..."
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                        <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10 hover:border-purple-500/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                        <p className="text-slate-400 text-sm mb-2">Our team is here to help</p>
                        <a href="mailto:support@braveecom.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                          support@braveecom.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10 hover:border-purple-500/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Call Us</h3>
                        <p className="text-slate-400 text-sm mb-2">Mon-Fri from 9am to 6pm</p>
                        <a href="tel:+919876543210" className="text-blue-400 hover:text-blue-300 transition-colors">
                          +91 98765 43210
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10 hover:border-purple-500/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Visit Us</h3>
                        <p className="text-slate-400 text-sm mb-2">Come say hello at our office</p>
                        <p className="text-slate-300 text-sm">
                          123 Business Park<br />
                          Mumbai, Maharashtra 400001<br />
                          India
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Hours */}
                <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Monday - Friday</span>
                      <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Saturday</span>
                      <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Sunday</span>
                      <span className="text-slate-500">Closed</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
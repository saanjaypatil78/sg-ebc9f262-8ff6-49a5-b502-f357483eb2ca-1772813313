import { SEO } from "@/components/SEO";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";

// Lazy load confetti
const Confetti = dynamic(() => import("@/components/Confetti").then(mod => ({ default: mod.Confetti })), { ssr: false });

export default function ContactPage() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setShowConfetti(true);
      toast({
        title: "Message Sent! 🎉",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <SEO title="Contact Us | Brave Ecom" description="Get in touch with our team" />
      <Confetti trigger={showConfetti} duration={4000} />
      
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div 
            style={{ y: y1 }}
            className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div 
            style={{ y: y2 }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div 
          ref={containerRef}
          style={{ opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Have questions? We're here to help you build your financial future.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassmorphicCard className="p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label className="text-slate-300">Your Name</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="mt-2 bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Email Address</Label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="mt-2 bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Message</Label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      rows={5}
                      className="mt-2 bg-white/5 border-white/10 text-white resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </GlassmorphicCard>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  content: "support@bravecom.info",
                  link: "mailto:support@bravecom.info"
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  content: "+91 8433783789",
                  link: "tel:+918433783789"
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  content: "201, Neel Solitaire, OLD PANVEL",
                  link: "#"
                },
                {
                  icon: Clock,
                  title: "Business Hours",
                  content: "Mon - Fri: 9:00 AM - 6:00 PM",
                  link: "#"
                },
                {
                  icon: Globe,
                  title: "Website",
                  content: "www.bravecom.info",
                  link: "https://www.bravecom.info"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <GlassmorphicCard className="p-6 border border-white/10 hover:border-purple-500/30 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <a 
                          href={item.link}
                          className="text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          {item.content}
                        </a>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
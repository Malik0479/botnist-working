import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            submitted_at: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "",
        message: ""
      });

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-8">
            Get In <span className="text-wood-accent">Touch</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about Forest Scribe? Want to discuss a custom solution? 
            We'd love to hear from you and help transform your website with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-lg bg-card border border-border hover:border-wood-accent/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-wood-accent/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-wood-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email Us</h3>
                  <p className="text-muted-foreground">hello@forestscribe.com</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Send us an email anytime. We typically respond within 24 hours.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border hover:border-wood-accent/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-wood-accent/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-wood-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Call Us</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Available Monday to Friday, 9 AM to 6 PM EST.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border hover:border-wood-accent/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-wood-accent/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-wood-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Visit Us</h3>
                  <p className="text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Located in the heart of Silicon Valley's innovation district.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-wood-accent/10 to-forest-accent/10 border border-wood-accent/20">
              <h3 className="font-semibold text-foreground mb-4">Why Choose Forest Scribe?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-wood-accent" />
                  <span className="text-muted-foreground">24/7 AI-powered responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-wood-accent" />
                  <span className="text-muted-foreground">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-wood-accent" />
                  <span className="text-muted-foreground">Dedicated support team</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-wood-accent" />
                  <span className="text-muted-foreground">Custom integrations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Glowing Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-wood-accent/20 to-forest-accent/20 rounded-lg blur-xl"></div>
              
              {/* Main Form Container */}
              <div className="relative bg-card/80 backdrop-blur-sm rounded-lg border-2 border-wood-accent/30 p-8 shadow-2xl hover:border-wood-accent/50 transition-all duration-500 hover:shadow-glow">
                
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        Send Us a Message
                      </h2>
                      <p className="text-muted-foreground">
                        Fill out the form below and we'll get back to you as soon as possible.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-foreground font-medium">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                            placeholder="John Smith"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground font-medium">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-foreground font-medium">
                            Company
                          </Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                            placeholder="Your Company"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-foreground font-medium">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-foreground font-medium">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                          placeholder="What's this about?"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-foreground font-medium">
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20 resize-none"
                          placeholder="Tell us more about your project, questions, or how we can help..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-wood-accent hover:bg-wood-accent/90 text-background font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-glow"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-wood-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-wood-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-wood-accent text-wood-accent hover:bg-wood-accent/10"
                    >
                      Send Another Message
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-2">How quickly can I get started?</h3>
              <p className="text-muted-foreground text-sm">
                You can have your AI chatbot up and running in less than 5 minutes. Just paste your website URL and we'll handle the rest.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-2">Do you offer custom integrations?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! Our Enterprise plan includes custom integrations, dedicated onboarding, and priority support for your specific needs.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground text-sm">
                Absolutely. We use enterprise-grade security with end-to-end encryption and SOC 2 compliance to protect your data.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
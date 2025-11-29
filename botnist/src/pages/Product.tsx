import { useState, useEffect } from "react";
import { ArrowRight, Globe, Database, Bot, Cpu, Code, Server, Cloud, Shield } from "lucide-react";

const Product = () => {
  const [visibleStep, setVisibleStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleStep((prev) => (prev + 1) % 8);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flowSteps = [
    { icon: Globe, title: "User", description: "Website owner starts the process" },
    { icon: ArrowRight, title: "Paste Website Link", description: "Submit URL for analysis" },
    { icon: Database, title: "Data Scraping", description: "Extract content from website" },
    { icon: Cpu, title: "NLP-Based Classification", description: "Analyze and categorize content" },
    { icon: Code, title: "Chunking & Embedding", description: "Process into vector embeddings" },
    { icon: Server, title: "Vector Database", description: "Store in ChromaDB" },
    { icon: Bot, title: "RAG-Powered Chatbot", description: "Generate intelligent responses" },
    { icon: Globe, title: "API Response to User", description: "Deliver insights back to user" }
  ];

  const technologies = [
    {
      category: "Frontend",
      items: ["JavaScript"]
    },
    {
      category: "Backend & API",
      items: ["Node.js / Express.js", "FastAPI/Python"]
    },
    {
      category: "Web Scraping",
      items: ["Apify", "BeautifulSoup", "Puppeteer"]
    },
    {
      category: "Natural Language Processing",
      items: ["spaCy", "nltk for text classification"]
    },
    {
      category: "Embeddings",
      items: ["openai small via HuggingFace Transformers"]
    },
    {
      category: "Vector Database",
      items: ["ChromaDB (self-hosted, local storage)"]
    },
    {
      category: "RAG Pipeline",
      items: ["GPT 3.5"]
    },
    {
      category: "Hosting",
      items: ["Render"]
    },
   
    {
      category: "API Access Control",
      items: ["Authentication & Rate Limiting"]
    }
  ];

  const marketingPoints = [
    {
      icon: Bot,
      title: "Intelligent Website Analysis",
      description: "Transform any website into an intelligent, conversational AI assistant that understands your content deeply."
    },
    {
      icon: Cpu,
      title: "Advanced NLP Processing", 
      description: "State-of-the-art natural language processing ensures accurate content classification and understanding."
    },
    {
      icon: Database,
      title: "Lightning-Fast Retrieval",
      description: "Vector database technology enables instant, contextually relevant responses to user queries."
    },
    {
      icon: Cloud,
      title: "Scalable Infrastructure",
      description: "Built on modern cloud infrastructure to handle websites of any size with consistent performance."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Robust API access controls and secure data handling protect your website content and user interactions."
    },
    {
      icon: Code,
      title: "Developer-Friendly",
      description: "Simple API integration with comprehensive documentation gets you up and running in minutes."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6">
        
        {/* Overview Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-8">
              Transform Your Website Into an 
              <span className="text-wood-accent block mt-2">AI-Powered Assistant</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Forest Scribe automatically converts any website into an intelligent chatbot using advanced 
              RAG (Retrieval-Augmented Generation) technology. Simply paste your website URL and watch 
              as our AI creates a conversational interface that understands your content deeply and 
              provides accurate, contextual responses to user queries.
            </p>
          </div>
        </section>

        {/* Flow Diagram Section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground text-center mb-16">
              How It <span className="text-wood-accent">Works</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {flowSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = visibleStep === index;
                const isVisible = index <= visibleStep;
                
                return (
                  <div
                    key={index}
                    className={`relative p-6 rounded-lg border transition-all duration-500 ${
                      isActive 
                        ? 'bg-wood-accent/10 border-wood-accent shadow-glow scale-105' 
                        : isVisible 
                        ? 'bg-card border-border' 
                        : 'bg-muted/50 border-muted opacity-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'bg-wood-accent text-background' : 'bg-wood-accent/20 text-wood-accent'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    
                    {index < flowSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className={`w-6 h-6 transition-colors duration-300 ${
                          isVisible ? 'text-wood-accent' : 'text-muted'
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tools & Technologies Section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground text-center mb-16">
              🛠️ <span className="text-wood-accent">Tools & Technologies</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-card border border-border hover:border-wood-accent/50 transition-all duration-300 hover:shadow-wood"
                >
                  <h3 className="text-lg font-semibold text-wood-accent mb-4">{tech.category}</h3>
                  <ul className="space-y-2">
                    {tech.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-muted-foreground flex items-center">
                        <div className="w-2 h-2 bg-wood-accent rounded-full mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing Points Section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground text-center mb-16">
              Why Choose <span className="text-wood-accent">Forest Scribe</span>?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {marketingPoints.map((point, index) => {
                const Icon = point.icon;
                
                return (
                  <div
                    key={index}
                    className="p-8 rounded-lg bg-card border border-border hover:border-wood-accent/50 transition-all duration-300 hover:shadow-glow group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-wood-accent/10 flex items-center justify-center group-hover:bg-wood-accent/20 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-wood-accent" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">{point.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto p-12 rounded-lg bg-gradient-to-r from-wood-accent/10 to-forest-accent/10 border border-wood-accent/20">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to Transform Your Website?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses already using AI-powered website assistants
            </p>
            <button className="px-8 py-4 bg-wood-accent text-background font-semibold rounded-lg hover:bg-wood-accent/90 transition-colors duration-300 shadow-glow">
              Get Started Today
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Product;
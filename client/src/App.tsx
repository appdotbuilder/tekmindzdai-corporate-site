
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { 
  Offering, 
  Solution, 
  Service, 
  Insight, 
  CaseStudy, 
  LeadershipProfile, 
  CreateContactSubmissionInput 
} from '../../server/src/schema';

function App() {
  // State for dynamic content
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [leadershipProfiles, setLeadershipProfiles] = useState<LeadershipProfile[]>([]);
  
  // Contact form state
  const [contactForm, setContactForm] = useState<CreateContactSubmissionInput>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Load all data
  const loadData = useCallback(async () => {
    try {
      const [
        offeringsData,
        solutionsData,
        servicesData,
        insightsData,
        caseStudiesData,
        leadershipData
      ] = await Promise.all([
        trpc.getOfferings.query(),
        trpc.getSolutions.query(),
        trpc.getServices.query(),
        trpc.getInsights.query(),
        trpc.getCaseStudies.query(),
        trpc.getLeadershipProfiles.query()
      ]);

      setOfferings(offeringsData);
      setSolutions(solutionsData);
      setServices(servicesData);
      setInsights(insightsData);
      setCaseStudies(caseStudiesData);
      setLeadershipProfiles(leadershipData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await trpc.createContactSubmission.mutate(contactForm);
      setSubmitMessage('Thank you! Your message has been sent successfully.');
      setContactForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-xl">
                TekMindzDAI
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('overview')} className="text-gray-600 hover:text-blue-600 transition-colors">
                Overview
              </button>
              <button onClick={() => scrollToSection('offerings')} className="text-gray-600 hover:text-blue-600 transition-colors">
                Offerings
              </button>
              <button onClick={() => scrollToSection('solutions')} className="text-gray-600 hover:text-blue-600 transition-colors">
                Solutions
              </button>
              <button onClick={() => scrollToSection('insights')} className="text-gray-600 hover:text-blue-600 transition-colors">
                Insights
              </button>
              <button onClick={() => scrollToSection('case-studies')} className="text-gray-600 hover:text-blue-600 transition-colors">
                Case Studies
              </button>
              <button onClick={() => scrollToSection('leadership')} className="text-gray-600 hover:text-blue-600 transition-colors">
                Leadership
              </button>
              <button onClick={() => scrollToSection('ai-learning')} className="text-gray-600 hover:text-blue-600 transition-colors">
                AI Learning
              </button>
            </nav>

            <Button onClick={() => scrollToSection('contact')} className="bg-blue-600 hover:bg-blue-700">
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <div className="text-blue-200 mb-4">
              Home → Data Intelligence → AI Solutions
            </div>
            
            {/* Tag */}
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-400 mb-6">
              🚀 Next-Gen AI Solutions
            </Badge>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transforming Businesses with 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> AI Intelligence</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Unlock the power of data-driven insights and artificial intelligence to accelerate your digital transformation journey and drive unprecedented business growth.
            </p>

            {/* CTA Button */}
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
              Transform with Us
            </Button>

            {/* Slider Navigation */}
            <div className="mt-12 text-blue-200">
              01 / 03
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pioneering the Future of Data Intelligence
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At TekMindzDAI, we envision a world where artificial intelligence and data analytics seamlessly integrate 
              to solve complex business challenges. Our mission is to empower organizations with cutting-edge AI solutions, 
              advanced data processing capabilities, and intelligent automation that drives measurable results. We believe 
              in transforming raw data into actionable insights that fuel innovation, optimize operations, and create 
              sustainable competitive advantages in an ever-evolving digital landscape.
            </p>
            <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Know More
            </Button>
          </div>
        </div>
      </section>

      {/* Our Offerings Section */}
      <section id="offerings" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Offerings</h2>
            <p className="text-lg text-gray-600">Comprehensive AI and data intelligence solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.length > 0 ? (
              offerings.map((offering: Offering) => (
                <Card key={offering.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-900">{offering.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {offering.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // Placeholder content when no data is available
              <>
                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-900">🤖 Generative AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      Harness the power of advanced generative AI models to create content, automate processes, and generate insights that drive innovation across your organization.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-900">🧠 Agentic AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      Deploy intelligent AI agents that can reason, plan, and execute complex tasks autonomously, revolutionizing how your business operates and scales.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-900">📊 Data Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      Transform your data into strategic advantages with our comprehensive analytics solutions, featuring real-time insights and predictive modeling capabilities.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Solutions</h2>
            <p className="text-lg text-gray-600">Industry-specific AI solutions tailored for your needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.length > 0 ? (
              solutions.map((solution: Solution) => (
                <Card key={solution.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-900">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {solution.description.length > 150 
                        ? `${solution.description.substring(0, 150)}...` 
                        : solution.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // Placeholder content
              <>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-900">📄 Intelligent Document Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      Automate document analysis, extraction, and processing using advanced AI to streamline your workflows and reduce manual effort...
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-900">🔧 Predictive Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      Leverage IoT sensors and machine learning to predict equipment failures before they occur, minimizing downtime and optimizing...
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Services</h2>
            <p className="text-lg text-gray-600">End-to-end AI and data services for your digital transformation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.length > 0 ? (
              services.map((service: Service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base">
                      {service.description.length > 200 
                        ? `${service.description.substring(0, 200)}...` 
                        : service.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // Placeholder content
              <>
                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-900">🤖 AI & Machine Learning Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base">
                      Complete AI development lifecycle services including model design, training, deployment, and optimization. Our expert team delivers custom AI solutions that align with your business objectives and drive measurable outcomes.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-900">📊 Data Engineering & Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base">
                      Comprehensive data infrastructure services including data pipeline development, warehouse design, real-time processing, and advanced analytics to unlock the full potential of your data assets.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section id="insights" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Insights</h2>
            <p className="text-lg text-gray-600">Latest thoughts and perspectives on AI and data intelligence</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.length > 0 ? (
              insights.map((insight: Insight) => (
                <div key={insight.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{insight.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{insight.description}</p>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </button>
                </div>
              ))
            ) : (
              // Placeholder content
              <>
                <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">The Future of Generative AI in Enterprise</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Exploring how generative AI is reshaping business processes and creating new opportunities for innovation across industries.
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Privacy in the AI Era</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Understanding the critical balance between AI innovation and data privacy protection in modern business environments.
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Building Ethical AI Systems</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Best practices for developing AI solutions that are transparent, fair, and aligned with ethical business principles.
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h2>
            <p className="text-lg text-gray-600">Real-world success stories and transformative results</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.length > 0 ? (
              caseStudies.map((caseStudy: CaseStudy) => (
                <Card key={caseStudy.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <div className="mb-2">
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        {caseStudy.main_title}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">{caseStudy.primary_subtitle}</CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {caseStudy.primary_description}
                    </CardDescription>
                  </CardHeader>
                  {caseStudy.secondary_subtitle && caseStudy.secondary_description && (
                    <CardContent>
                      <Separator className="mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">{caseStudy.secondary_subtitle}</h4>
                      <p className="text-gray-600 leading-relaxed">{caseStudy.secondary_description}</p>
                    </CardContent>
                  )}
                  <CardFooter>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // Placeholder content
              <>
                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <div className="mb-2">
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Generative AI
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">Transforming Customer Service with AI Chatbots</CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      A leading e-commerce company reduced customer service response time by 75% and improved satisfaction scores by implementing our advanced AI chatbot solution.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Implementation Results</h4>
                    <p className="text-gray-600 leading-relaxed">
                      The solution processed over 100,000 customer queries monthly with 95% accuracy, resulting in $2M annual savings in support costs while maintaining exceptional customer experience.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <div className="mb-2">
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Data Analytics
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">Predictive Analytics for Supply Chain Optimization</CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      A multinational manufacturer achieved 30% reduction in inventory costs and 25% improvement in delivery times through our predictive analytics platform.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our leadership team combines decades of experience in artificial intelligence, data science, and enterprise technology. 
              They guide our vision of making AI accessible and transformative for businesses across all industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipProfiles.length > 0 ? (
              leadershipProfiles.map((profile: LeadershipProfile) => (
                <div key={profile.id} className="text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h3>
                  <p className="text-gray-600">{profile.title}</p>
                </div>
              ))
            ) : (
              // Placeholder content
              <>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    JS
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Dr. Jane Smith</h3>
                  <p className="text-gray-600">Chief Executive Officer & Co-Founder</p>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-blue-600 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    MJ
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Michael Johnson</h3>
                  <p className="text-gray-600">Chief Technology Officer</p>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    SC
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Sarah Chen</h3>
                  <p className="text-gray-600">Chief Data Scientist</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* AI Learning Section */}
      <section id="ai-learning" className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Learning Hub</h2>
            <h3 className="text-2xl text-gray-700 mb-6">Expand Your AI Knowledge</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Stay ahead of the AI revolution with our comprehensive learning resources. From beginner-friendly tutorials 
              to advanced research insights, we provide the knowledge you need to understand and leverage artificial 
              intelligence in your business and career.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">🎥</div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Webinars</h4>
                <p className="text-gray-600 text-sm">Live sessions with industry experts</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">📚</div>
                <h4 className="font-semibold text-gray-900 mb-2">Training Programs</h4>
                <p className="text-gray-600 text-sm">Structured learning paths for all levels</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-m transition-shadow">
                <div className="text-3xl mb-3">🆓</div>
                <h4 className="font-semibold text-gray-900 mb-2">Free Resources</h4>
                <p className="text-gray-600 text-sm">Whitepapers, guides, and tools</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">👥</div>
                <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
                <p className="text-gray-600 text-sm">Connect with AI enthusiasts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Pane - Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">📞 Call Us</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">✉️ Email Address</h3>
                  <p className="text-gray-300">contact@tekminzdai.com</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">🏢 USA Headquarters</h3>
                  <p className="text-gray-300">
                    123 AI Innovation Drive<br />
                    Silicon Valley, CA 94000<br />
                    United States
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">🇮🇳 India Operations</h3>
                  <p className="text-gray-300">
                    Tech Park, Block B-4<br />
                    Bangalore, Karnataka 560100<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* Right Pane - Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Send Us A Message</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="First Name"
                      value={contactForm.first_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setContactForm((prev: CreateContactSubmissionInput) => ({ 
                          ...prev, 
                          first_name: e.target.value 
                        }))
                      }
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Last Name"
                      value={contactForm.last_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setContactForm((prev: CreateContactSubmissionInput) => ({ 
                          ...prev, 
                          last_name: e.target.value 
                        }))
                      }
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <Input
                  type="email"
                  placeholder="Email Address"
                  value={contactForm.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContactForm((prev: CreateContactSubmissionInput) => ({ 
                      ...prev, 
                      email: e.target.value 
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />

                <Input
                  type="tel"
                  placeholder="Phone"
                  value={contactForm.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContactForm((prev: CreateContactSubmissionInput) => ({ 
                      ...prev, 
                      phone: e.target.value 
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />

                <Textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContactForm((prev: CreateContactSubmissionInput) => ({ 
                      ...prev, 
                      message: e.target.value 
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[120px]"
                  required
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </Button>

                {submitMessage && (
                  <p className={`text-sm ${submitMessage.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-xl">
                TekMindzDAI
              </div>
            </div>
            
            <p className="text-gray-400 text-center md:text-right">
              © 2024 TekMindzDAI. All rights reserved. | Transforming businesses with AI intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

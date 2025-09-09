import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Award, Target, Users, Zap } from "lucide-react";
import georgeImage from "../assets/george-raymond-alshoufi-AI-educator-AI-expert-Switzerland.webp";

const stats = [
  {
    icon: Users,
    value: "5,000+",
    label: "Students Trained",
    description: "Professionals across 50+ countries"
  },
  {
    icon: Award,
    value: "98%",
    label: "Success Rate",
    description: "Students who complete our programs"
  },
  {
    icon: Target,
    value: "15+",
    label: "Industry Partners",
    description: "Leading tech companies"
  },
  {
    icon: Zap,
    value: "4.9★",
    label: "Average Rating",
    description: "Based on 2,500+ reviews"
  }
];

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "AI Research Director",
    background: "Former Google AI, Stanford PhD",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "George Raymond-Alshoufi",
    role: "AI Training Specialist",
    background: "MSc HEC Paris, MIT Sloan & CSAIL Certified",
    image: georgeImage
  },
  {
    name: "Dr. Emily Watson",
    role: "Data Science Expert",
    background: "Former Microsoft Research, Oxford PhD",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  }
];

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
                <Award className="w-4 h-4 mr-2" />
                About AI Workshop
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold">
                Pioneering AI Education Since 2018
              </h2>
              <p className="text-xl text-gray-600">
                We're on a mission to democratize AI education, making cutting-edge 
                artificial intelligence knowledge accessible to everyone, from complete 
                beginners to seasoned professionals.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-medium">Expert-Led Curriculum</h4>
                  <p className="text-gray-600">
                    Courses designed and taught by industry leaders from top tech companies.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-medium">Hands-On Learning</h4>
                  <p className="text-gray-600">
                    Real projects and case studies that prepare you for actual AI implementation.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-medium">Continuous Support</h4>
                  <p className="text-gray-600">
                    24/7 access to mentors and a thriving community of AI practitioners.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1560523159-94c9d18bcf27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwY29uZmVyZW5jZXxlbnwxfHx8fDE3NTY1MDA3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Modern tech conference"
              className="w-full h-[400px] object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur rounded-lg p-4">
                <div className="text-sm font-medium text-gray-900">Live Workshop</div>
                <div className="text-xs text-gray-600">Deep Learning in Action</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  250+ participants online
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">Meet Our Expert Team</h3>
          <p className="text-gray-600 max-w-[600px] mx-auto">
            Learn from industry veterans who have built AI systems at the world's 
            leading technology companies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center overflow-hidden">
              <CardContent className="pt-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h4 className="font-bold mb-1">{member.name}</h4>
                <Badge variant="secondary" className="mb-2">{member.role}</Badge>
                <p className="text-sm text-gray-600">{member.background}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
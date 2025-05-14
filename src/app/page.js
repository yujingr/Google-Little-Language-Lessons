import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-white">
      <div className="flex flex-col lg:flex-row items-center lg:items-start max-w-7xl mx-auto w-full px-6 py-16 gap-12">
        {/* Left: Title and Subtitle */}
        <div className="flex-1 flex flex-col justify-center items-start max-w-xl">
          <h1
            className="text-6xl md:text-7xl font-black leading-tight mb-4 text-black"
            style={{ lineHeight: 1.1 }}
          >
            Little
            <br />
            Language
            <br />
            Lessons
            <span
              role="img"
              aria-label="globe"
              className="inline-block align-middle ml-2 text-5xl"
            >
              🌍
            </span>
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            A collection of bite-sized learning experiments
            <br />
            built with Gemini.
          </p>
        </div>
        {/* Right: Experiment Cards */}
        <div className="flex-1 flex flex-col gap-8 w-full max-w-xl">
          {/* Tiny Lesson Card */}
          <Card className="flex flex-row items-center p-8 bg-blue-50/60 rounded-3xl shadow-none">
            <div className="flex-1">
              <CardHeader className="p-0 mb-2">
                <span className="text-xs tracking-widest text-blue-700 font-mono font-semibold mb-2 block">
                  EXPERIMENT NO. 001
                </span>
                <CardTitle className="text-4xl font-black mb-2">
                  Tiny Lesson
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Find relevant vocabulary, phrases, and grammar tips for any
                  situation.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <Link href="/tiny-lesson" passHref legacyBehavior>
                  <Button
                    as="a"
                    variant="outline"
                    className="rounded-full px-6 py-2 font-semibold text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    Try it <span className="ml-2">→</span>
                  </Button>
                </Link>
              </CardContent>
            </div>
            <div className="ml-8 hidden md:block">
              <Image
                src="/hand-ladybug.png"
                alt="Tiny Lesson"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          </Card>
          {/* Slang Hang Card */}
          <Card className="flex flex-row items-center p-8 bg-blue-50/60 rounded-3xl shadow-none">
            <div className="flex-1">
              <CardHeader className="p-0 mb-2">
                <span className="text-xs tracking-widest text-blue-700 font-mono font-semibold mb-2 block">
                  EXPERIMENT NO. 002
                </span>
                <CardTitle className="text-4xl font-black mb-2">
                  Slang Hang
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Learn expressions, idioms, and regional slang from a generated
                  conversation between native speakers.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <Link href="/slang-hang" passHref legacyBehavior>
                  <Button
                    as="a"
                    variant="outline"
                    className="rounded-full px-6 py-2 font-semibold text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    Try it <span className="ml-2">→</span>
                  </Button>
                </Link>
              </CardContent>
            </div>
            <div className="ml-8 hidden md:block">
              <Image
                src="/mouth-slang.png"
                alt="Slang Hang"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

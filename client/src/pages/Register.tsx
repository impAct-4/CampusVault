import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/GlowButton";
import { GlowInput } from "../components/ui/GlowInput";
import { StepIndicator } from "../components/ui/StepIndicator";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useAuthStore, type AuthUser } from "../store/auth";
import { PageTransition } from "../components/layout/PageTransition";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  college: z.string().min(2),
  course: z.string().min(2),
  branch: z.string().min(2),
  year: z.number().int().min(1).max(5),
  gpa: z.number().min(0).max(10),
  targetRoles: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
  strongConcepts: z.array(z.string()).min(1),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  leetcodeUrl: z.string().url().optional().or(z.literal("")),
});

type RegisterValues = z.infer<typeof registerSchema>;

const roles = ["SWE", "Data Analyst", "DevOps", "ML Engineer", "Frontend Dev"];
const languages = ["Python", "Java", "C++", "JavaScript", "Go"];
const concepts = ["DSA", "DBMS", "OS", "CN", "System Design", "ML"];

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { register, handleSubmit, setValue } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      targetRoles: [],
      languages: [],
      strongConcepts: [],
      githubUrl: "",
      linkedinUrl: "",
      leetcodeUrl: "",
    },
  });

  const toggleRoles = (value: string) => {
    const next = selectedRoles.includes(value)
      ? selectedRoles.filter((item) => item !== value)
      : [...selectedRoles, value];
    setSelectedRoles(next);
    setValue("targetRoles", next);
  };

  const toggleLanguages = (value: string) => {
    const next = selectedLanguages.includes(value)
      ? selectedLanguages.filter((item) => item !== value)
      : [...selectedLanguages, value];
    setSelectedLanguages(next);
    setValue("languages", next);
  };

  const toggleConcepts = (value: string) => {
    const next = selectedConcepts.includes(value)
      ? selectedConcepts.filter((item) => item !== value)
      : [...selectedConcepts, value];
    setSelectedConcepts(next);
    setValue("strongConcepts", next);
  };

  const onSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      const payload = {
        ...values,
        githubUrl: values.githubUrl || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
        leetcodeUrl: values.leetcodeUrl || undefined,
      };
      const result = await apiRequest<{ user: AuthUser; accessToken: string; refreshToken: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setAuth(result);
      navigate("/assessment");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed.");
    }
  };

  return (
    <PageTransition>
      <PageWrapper title="Register" subtitle="Complete onboarding in 4 guided steps."> 
      <GlassCard>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <StepIndicator step={step} total={4} />

          {step === 1 ? (
            <div className="grid gap-3 md:grid-cols-2">
              <GlowInput {...register("name")} placeholder="Full Name" />
              <GlowInput {...register("email")} type="email" placeholder="Email" />
              <GlowInput {...register("password")} type="password" placeholder="Password" />
              <GlowInput {...register("phone")} placeholder="Phone" />
              <GlowInput className="md:col-span-2" {...register("college")} placeholder="College Name" />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 md:grid-cols-2">
              <GlowInput {...register("course")} placeholder="Course" />
              <GlowInput {...register("branch")} placeholder="Branch" />
              <GlowInput {...register("year", { valueAsNumber: true })} type="number" placeholder="Year" />
              <GlowInput
                {...register("gpa", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="GPA / CGPA"
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <SelectionGroup
                title="Target Roles"
                values={selectedRoles}
                options={roles}
                onToggle={toggleRoles}
              />
              <SelectionGroup
                title="Languages"
                values={selectedLanguages}
                options={languages}
                onToggle={toggleLanguages}
              />
              <SelectionGroup
                title="Strong Concepts"
                values={selectedConcepts}
                options={concepts}
                onToggle={toggleConcepts}
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-3 md:grid-cols-3">
              <GlowInput {...register("githubUrl")} placeholder="GitHub URL" />
              <GlowInput {...register("linkedinUrl")} placeholder="LinkedIn URL" />
              <GlowInput {...register("leetcodeUrl")} placeholder="LeetCode URL" />
            </div>
          ) : null}

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100"
              >
                Back
              </button>
            ) : null}

            {step < 4 ? (
              <GlowButton type="button" onClick={() => setStep((prev) => Math.min(4, prev + 1))}>
                Next
              </GlowButton>
            ) : (
              <GlowButton type="submit">Create Account</GlowButton>
            )}
          </div>
        </form>
      </GlassCard>
    </PageWrapper>
    </PageTransition>
  );
}

function SelectionGroup({
  title,
  options,
  values,
  onToggle,
}: {
  title: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-200">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-lg border px-3 py-1.5 text-xs ${
                selected
                  ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-100"
                  : "border-white/20 bg-black/20 text-slate-300"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}


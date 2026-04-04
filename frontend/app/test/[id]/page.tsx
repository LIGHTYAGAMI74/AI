"use client";

import { useParams, useRouter } from "next/navigation";
import ProctoredEnv from "@/components/ProctoredEnv";
import { useEffect, useState } from "react";
import { getModuleTests } from "@/services/module";

export default function TestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getModuleTests();
      const found = data.find((m: any) => m._id === id);
      setModule(found);
    };
    load();
  }, [id]);

  if (!module) return <div>Loading...</div>;

  return (
    <ProctoredEnv
      module={module}
      onExit={() => router.push("/dashboard")}
    />
  );
}
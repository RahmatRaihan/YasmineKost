import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { FacilityIcon } from "@/components/public/facility-icon";
import { Reveal } from "@/components/public/reveal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Fasilitas",
  description:
    "Fasilitas bersama Yasmine Kost: WiFi, dapur, parkir, keamanan 24 jam, dan lainnya.",
};

export default async function FasilitasPage() {
  const facilities = await prisma.facility.findMany({
    orderBy: { sort: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Fasilitas Bersama"
        description="Berbagai fasilitas yang bisa kamu nikmati selama tinggal di Yasmine Kost."
      />
      <div className="container py-12">
        {facilities.length === 0 ? (
          <p className="text-muted-foreground">Belum ada data fasilitas.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f, i) => (
              <Reveal key={f.id} delay={i * 70} className="h-full">
                <div className="h-full rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FacilityIcon name={f.icon} className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {f.name}
                  </h3>
                  {f.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {f.description}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

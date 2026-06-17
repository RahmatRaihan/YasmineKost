import Image from "next/image";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/settings";
import { uploadHeroImage, removeHeroImage } from "./actions";

export const metadata = { title: "Pengaturan" };

export default async function PengaturanPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <AdminPageHeader
        title="Pengaturan"
        description="Atur foto hero beranda, identitas situs, kontak, dan rekening transfer."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Foto hero */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">
                Foto Hero Beranda
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Foto besar di bagian atas beranda. Disarankan landscape (4:3),
                terang & berkualitas. Maks 5 MB.
              </p>

              <div className="mt-4 overflow-hidden rounded-xl border bg-muted">
                {settings.heroImage ? (
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={settings.heroImage}
                      alt="Foto hero"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-8" />
                    <span className="text-sm">Belum ada foto (pakai placeholder)</span>
                  </div>
                )}
              </div>

              <form action={uploadHeroImage} className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="heroImage">
                    {settings.heroImage ? "Ganti foto" : "Unggah foto"}
                  </Label>
                  <Input
                    id="heroImage"
                    name="heroImage"
                    type="file"
                    accept="image/*"
                    required
                  />
                </div>
                <Button type="submit" variant="secondary" className="w-full">
                  <Upload className="size-4" /> Unggah
                </Button>
              </form>

              {settings.heroImage && (
                <form action={removeHeroImage} className="mt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive hover:underline"
                  >
                    <Trash2 className="size-4" /> Hapus foto hero
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pengaturan teks */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <SettingsForm values={settings} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

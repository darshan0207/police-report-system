"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { reportSchema, ReportFormData } from "@/lib/schemas/report";
import { toast } from "sonner";
import { uploadFile } from "@/lib/cloudinary";
import { useSession } from "next-auth/react";

interface Unit {
  _id: string;
  name: string;
}

interface PoliceStation {
  _id: string;
  name: string;
}

interface DutyType {
  _id: string;
  name: string;
}

interface Officer {
  _id: string;
  name: string;
  isActive: boolean;
}

interface Arrangement {
  _id: string | null;
  name: string;
}

export default function ReportForm() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [arrangementsData, setArrangementsData] = useState<Arrangement[]>([]);
  const [dutyTypes, setDutyTypes] = useState<DutyType[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  console.log("data", session);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        લોડ કરી રહ્યું છે...
      </div>
    );
  }

  const isAdmin = session?.user?.role === "admin";
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema(isAdmin)),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      unit: "",
      policeStation: "",
      arrangement: "",
      dutyType: "",
      dutyCount: 0,
      verifyingOfficer: "",
      remarks: "",
      images: [],
      otherImage: "",
    },
  });

  const images = watch("images") || [];
  const otherImage = watch("otherImage") || "";

  useEffect(() => {
    Promise.all([
      fetch("/api/units").then((r) => r.json()),
      fetch("/api/police-stations").then((r) => r.json()),
      fetch("/api/duty-type").then((r) => r.json()),
      fetch("/api/officers").then((r) => r.json()),
      fetch("/api/arrangements").then((r) => r.json()),
    ]).then(([u, p, d, o, a]) => {
      setUnits(u);
      setStations(p);
      setDutyTypes(d);
      setOfficers(o.filter((officer: Officer) => officer.isActive));
      setArrangementsData(a);
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit
      // const isValidSize = file.size <= 200 * 1024; // 200kb limit

      if (!isValidType) {
        toast.error(`File ${file.name} is not an image`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`File ${file.name} is too large (max 2MB)`);
        return false;
      }
      return true;
    });

    const readers = validFiles.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((base64Images) => {
      // Assuming `images` is current state or form value
      setValue("images", [...images, ...base64Images]);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setValue("images", newImages);
  };
  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const file = files[0];
    const isValidType = file.type.startsWith("image/");
    const isValidSize = file.size <= 2 * 1024 * 1024;

    if (!isValidType) {
      toast.error(`File ${file.name} is not an image`);
      return;
    }

    if (!isValidSize) {
      toast.error(`File ${file.name} is too large (max 2MB)`);
      return;
    }

    // Convert to base64 string
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setValue("otherImage", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeNewImage = () => {
    setValue("otherImage", "");
  };

  const onSubmit = async (data: ReportFormData) => {
    setLoading(true);

    try {
      // Create FormData to handle file uploads
      console.log(data.images);
      if (data.images?.length) {
        try {
          const uploadPromises = data.images.map(async (image: any, index) => {
            try {
              return await uploadFile(image);
            } catch (error) {
              console.error(`Failed to upload image ${index}:`, error);
              return null; // or a placeholder image URL
            }
          });

          const uploadedUrls = await Promise.all(uploadPromises);
          data.images = uploadedUrls.filter((url) => url !== null); // Remove failed uploads

          console.log("Uploaded URLs:", data.images);
        } catch (error) {
          console.error("Image upload process failed:", error);
        }
      }

      if (data.otherImage) {
        try {
          const odakhImagesData = await uploadFile(data?.otherImage);

          data.otherImage = odakhImagesData; // Remove failed uploads

          console.log("Uploaded URLs:", otherImage);
        } catch (error) {
          console.error("Image upload process failed:", error);
        }
      }
      // Append images
      if (!data?.arrangement) data.arrangement = null;
      const response = await fetch("/api/reports", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("રિપોર્ટ સફળતાપૂર્વક સેવ થાયો છે!");
        // Reset form
        reset({
          date: new Date().toISOString().slice(0, 10),
          unit: "",
          policeStation: "",
          arrangement: "",
          dutyType: "",
          dutyCount: null as any,
          verifyingOfficer: "",
          remarks: "",
          images: [],
          otherImage: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error saving report");
      }
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("Error saving report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date Field */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date" className="mb-2">
            રિપોર્ટ તારીખ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Deployment Fields */}
      <div className="border p-4 rounded-lg space-y-4">
        <h4 className="font-medium">રિપોર્ટ માટેની માહિતી દાખલ કરો</h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Unit */}
          <div>
            <Label htmlFor="unit" className="mb-2">
              યુનિટ <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("unit")}
              onValueChange={(value) => setValue("unit", value)}
            >
              <SelectTrigger className={errors.unit ? "border-red-500" : ""}>
                <SelectValue placeholder="યુનિટ પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit._id} value={unit._id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unit && (
              <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
            )}
          </div>

          {/* Police Station */}
          <div>
            <Label htmlFor="policeStation" className="mb-2">
              પોલીસ સ્ટેશન <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("policeStation")}
              onValueChange={(value) => setValue("policeStation", value)}
            >
              <SelectTrigger
                className={errors.policeStation ? "border-red-500" : ""}
              >
                <SelectValue placeholder="પોલીસ સ્ટેશન પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station._id} value={station._id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.policeStation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.policeStation.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="arrangement" className="mb-2">
              બંદોબસ્તનો પ્રકાર
            </Label>
            <Select
              value={watch("arrangement") || ""}
              onValueChange={(value) => setValue("arrangement", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="બંદોબસ્તનો પ્રકાર પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>કોઈ નહિ</SelectItem>
                {arrangementsData.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duty Type */}
          <div>
            <Label htmlFor="dutyType" className="mb-2">
              ફરજનો પ્રકાર <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("dutyType")}
              onValueChange={(value) => setValue("dutyType", value)}
            >
              <SelectTrigger
                className={errors.dutyType ? "border-red-500" : ""}
              >
                <SelectValue placeholder="ફરજનો પ્રકાર પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                {dutyTypes.map((dutyType) => (
                  <SelectItem key={dutyType._id} value={dutyType._id}>
                    {dutyType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dutyType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dutyType.message}
              </p>
            )}
          </div>

          {/* Verifying Officer */}
          <div>
            <Label htmlFor="verifyingOfficer" className="mb-2">
              ચકાસણી અધિકારી <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("verifyingOfficer")}
              onValueChange={(value) => setValue("verifyingOfficer", value)}
            >
              <SelectTrigger
                className={errors.verifyingOfficer ? "border-red-500" : ""}
              >
                <SelectValue placeholder="અધિકારી પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                {officers.map((officer) => (
                  <SelectItem key={officer._id} value={officer._id}>
                    {officer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.verifyingOfficer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.verifyingOfficer.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duty Count */}
          <div>
            <Label htmlFor="dutyCount" className="mb-2">
              ફરજ ઉપર હાજર કુલ સંખ્યા <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dutyCount"
              type="number"
              min="0"
              {...register("dutyCount", { valueAsNumber: true })}
              className={errors.dutyCount ? "border-red-500" : ""}
            />
            {errors.dutyCount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dutyCount.message}
              </p>
            )}
          </div>
        </div>

        {/* Remarks */}

        {isAdmin && (
          <div>
            <Label htmlFor="remarks" className="mb-2">
              રિમાકસ
            </Label>
            <Textarea
              id="remarks"
              {...register("remarks")}
              placeholder="કોઈપણ રિમાકસ દાખલ કરો..."
            />
          </div>
        )}
      </div>

      {/* Image Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              ફોટા અપલોડ કરો{" "}
              {!isAdmin && <span className="text-red-500">*</span>}
            </h4>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  ફોટા અપલોડ કરવા માટે ક્લિક કરો અથવા ખેંચો અને છોડો
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, JPEG દરેક 2MB સુધી
                </span>
              </Label>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">
                {errors.images.message}
              </p>
            )}

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              હાજરી રેજિસ્ટર સહી સિક્કા સાથે નો ફોટોગ્રાફ{" "}
              {!isAdmin && <span className="text-red-500">*</span>}
            </h4>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleNewImageUpload}
                className="hidden"
                id="image1-upload"
              />
              <Label
                htmlFor="image1-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  હાજરી રેજિસ્ટર સહી સિક્કા સાથે નો ફોટોગ્રાફ અપલોડ કરવા માટે
                  ક્લિક કરો અથવા ખેંચો અને છોડો
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, JPEG દરેક 2MB સુધી
                </span>
              </Label>
            </div>
            {errors.otherImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.otherImage.message}
              </p>
            )}

            {/* Image Preview */}
            {otherImage && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative group">
                  <img
                    src={otherImage}
                    alt={`Upload preview`}
                    className="w-full h-24 object-contain rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage()}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "દૈનિક રિપોર્ટ સેવ થય રહો છે..." : "સેવ દૈનિક રિપોર્ટ"}
      </Button>
    </form>
  );
}

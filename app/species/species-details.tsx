"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import { createClient } from '@supabase/supabase-js';

// Assuming you have a species prop passed to this component
// Adjust the type according to your actual species data structure
interface SpeciesType {
  scientific_name: string;
  common_name: string;
  total_population: number | null;
  kingdom: string;
  description: string;
  author: string;
}


export default function SpeciesDetailsPopup({ species, authorid }: { species: SpeciesType, authorid: string }) {
  const [open, setOpen] = useState<boolean>(false); // This might be passed as a prop instead, depending on your dialog open/close logic
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>(''); // Added state for display name

  const closeDialog = () => {
    setOpen(false);
    router.refresh(); // Or any other logic you need to run when closing the dialog
  };

  useEffect(() => {
    const fetchDisplayName = async () => {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      try {
        const { data, error } = await supabase
          .from('profiles') // Assuming 'users' was a mistake and you meant 'profiles'
          .select('display_name')
          .eq('id', authorid)
          .single();
        if (error) throw error;
        if (data) setDisplayName(data.display_name);
      } catch (error) {
        console.error('Error fetching display name:', error);
      }
    };

    fetchDisplayName();
  }, [authorid]);



  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
    <div className="flex justify-center mt-4"> {/* This div centers the button horizontally */}
        <Button variant="secondary" className="bg-green-500 text-white"> {/* Adjust the button's color */}
          View Details
        </Button>
      </div>
    </DialogTrigger>
      <DialogClose asChild>
        <Button variant="secondary" className="absolute top-0 right-0" onClick={closeDialog}>Close</Button>
      </DialogClose>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <div className="text-center">
            <DialogTitle>Species Details</DialogTitle>
          </div>
        </DialogHeader>
        {/* Display species details */}
        <div className="text-center">
          <p><strong>Scientific Name:</strong> {species.scientific_name}</p>
          <p><strong>Common Name:</strong> {species.common_name}</p>
          <p><strong>Total Population:</strong> {species.total_population}</p>
          <p><strong>Kingdom:</strong> {species.kingdom}</p>
          <p><strong>Description:</strong> {species.description}</p>
          <p><strong>Author:</strong> {displayName}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

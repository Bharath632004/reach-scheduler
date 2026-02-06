import { Email } from "@/types/email";
import { ChevronLeft, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface EmailDetailViewProps {
  email: Email;
  onBack: () => void;
}

export default function EmailDetailView({ email, onBack }: EmailDetailViewProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="rounded-lg p-1 hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">{email.subject} | {email.id}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Archive className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <span className="text-sm font-bold text-green-700">A</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Amanda Clark</p>
            <p className="text-sm text-gray-500">
              {email.sender || "sender@example.com"}
            </p>
            <p className="text-right text-sm text-gray-500">
              {format(new Date(email.scheduledAt), "MMM d, h:mm a")}
            </p>
          </div>
        </div>

        <div className="mb-6 text-gray-900">
          <p className="mb-4">Hey Oliver,</p>
          <p className="mb-4">{email.body}</p>
        </div>

        <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-900">
            You've just RECEIVED something
          </p>
          <p className="mt-2 font-medium text-yellow-900">
            Extremely Exclusive—Only 4 Spots Worldwide Per Year | $25,000 investment
          </p>
          <p className="mt-2 text-sm text-yellow-900">
            To explore securing your private transformation, simply reply right now with "FLY OUT FIX"
          </p>
        </div>

        <div className="mt-8">
          <p className="mb-2 text-sm text-gray-600">Your coach for world-class performance,</p>
          <p className="font-medium text-gray-900">Grant</p>
          <p className="mt-4 text-xs italic text-gray-500">
            P.S. Always remember that you can develop world class technique!
          </p>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-sm font-medium text-gray-900">Attachments:</p>
          <div className="flex gap-4">
            <div className="rounded-lg border border-gray-200 bg-blue-50 p-4 text-center">
              <img
                src="https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Tennis Coach Profile"
                className="h-24 w-24 rounded-lg object-cover"
              />
              <p className="mt-2 text-xs font-medium text-gray-700">Tennis_Coach_Profile.png</p>
              <p className="text-xs text-gray-500">1.2 MB</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-blue-50 p-4 text-center">
              <img
                src="https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Tennis Coach Profile 2"
                className="h-24 w-24 rounded-lg object-cover"
              />
              <p className="mt-2 text-xs font-medium text-gray-700">Tennis_Coach_Profile2.png</p>
              <p className="text-xs text-gray-500">1.2 MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

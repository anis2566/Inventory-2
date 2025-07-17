import { ChevronRight, PlusCircle, LogOut, LogIn, NotepadTextDashed } from 'lucide-react';
import Link from 'next/link';

const actions = [
    {
        id: 1,
        title: 'New Order',
        description: "Place a new order",
        icon: <PlusCircle size={24} className="text-blue-400" />,
        bgColor: 'bg-blue-900/30',
        borderColor: 'border-blue-800',
        href: "/order/new"
    },
    {
        id: 4,
        title: 'New Outgoing',
        description: "Create a new outgoing",
        icon: <LogOut size={24} className="text-orange-400" />,
        bgColor: 'bg-orange-900/30',
        borderColor: 'border-orange-800',
        href: "/outgoing/new"
    },
    {
        id: 2,
        title: 'New Incoming',
        description: "Create a new incoming",
        icon: <LogIn size={24} className="text-green-400" />,
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-800',
        href: "/incoming/new"
    },
    {
        id: 3,
        title: 'Daily Report',
        description: 'Explore your daily report',
        icon: <NotepadTextDashed size={24} className="text-purple-400" />,
        bgColor: 'bg-purple-900/30',
        borderColor: 'border-purple-800',
        href: "/report/daily"
    },
];

const QuickActions = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action) => (
                <Link key={action.id} href={action.href} prefetch>
                    <button
                        className={`group w-full rounded-lg p-4 border transition-all duration-200 hover:scale-105 hover:shadow-lg ${action.bgColor} ${action.borderColor} hover:border-opacity-80`}
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-gray-700 group-hover:bg-gray-600 transition-colors duration-200">
                                {action.icon}
                            </div>

                            <div className="ml-4 text-left flex-1">
                                <h3 className="font-semibold text-white group-hover:text-gray-100 transition-colors duration-200">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200 mt-1">
                                    {action.description}
                                </p>
                            </div>

                            <ChevronRight
                                size={20}
                                className="text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200"
                            />
                        </div>
                    </button>
                </Link>
            ))}
        </div>
    );
};

export default QuickActions;
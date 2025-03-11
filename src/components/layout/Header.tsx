import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { AvatarImage } from '@radix-ui/react-avatar';
import { LinkedInLogoIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-semibold">
            IMBOR Explorer
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  Zoeken
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/schema" className={navigationMenuTriggerStyle()}>
                  Schema Explorer
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="rounded-full">
              <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/62135837?v=4" />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="flex">
            <div className="justify-between space-x-1">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Sietze Soet</h4>
                <div className="flex items-center pt-2">
                  <LinkedInLogoIcon className="mr-2 h-4 w-4" />
                  <a
                    href="https://www.linkedin.com/in/sietzesoet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    @sietzesoet
                  </a>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
};

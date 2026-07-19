# Admin Dashboard & Payment Detail — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILLS: None — execute inline.

**Goal:** Replace hardcoded dashboard data with real DB analytics + add payment detail modal.

**Architecture:** New `AdminDashboardController` with one endpoint returning aggregated stats. FE consumes it with charts (recharts) and stat cards. Payment modal uses existing `/payments` data.

**Tech Stack:** .NET 9, EF Core, MySQL, React, Chakra UI, recharts

## Global Constraints

- Admin role required for new endpoint
- All UI matches existing dark theme: bg `#141720`, border `#1e2028`, accent `#E03030`, text white/`#8A8A93`
- All monetary values displayed in VND format

---

### Task 1: BE DTOs for Admin Dashboard

**Files:**
- Create: `backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/AdminDashboardDto.cs`
- Create: `backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/MonthlyValueDto.cs`
- Create: `backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/MonthlyCountDto.cs`
- Create: `backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/PackageStatDto.cs`

**Interfaces:**
- Produces: `AdminDashboardDto`, `MonthlyValueDto`, `MonthlyCountDto`, `PackageStatDto`

- [ ] **Step 1: Create MonthlyValueDto.cs**

```csharp
namespace FitnessTrainingSystem.Application.DTOs.Dashboard;

public class MonthlyValueDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
```

- [ ] **Step 2: Create MonthlyCountDto.cs**

```csharp
namespace FitnessTrainingSystem.Application.DTOs.Dashboard;

public class MonthlyCountDto
{
    public string Month { get; set; } = string.Empty;
    public int Count { get; set; }
}
```

- [ ] **Step 3: Create PackageStatDto.cs**

```csharp
namespace FitnessTrainingSystem.Application.DTOs.Dashboard;

public class PackageStatDto
{
    public string PackageName { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Revenue { get; set; }
}
```

- [ ] **Step 4: Create AdminDashboardDto.cs**

```csharp
using FitnessTrainingSystem.Application.DTOs.Payments;

namespace FitnessTrainingSystem.Application.DTOs.Dashboard;

public class AdminDashboardDto
{
    // Users
    public int TotalUsers { get; set; }
    public int NewUsersThisMonth { get; set; }

    // Subscriptions
    public int ActiveSubscriptions { get; set; }
    public int ExpiredSubscriptions { get; set; }
    public double SubscriptionRate { get; set; }

    // Revenue
    public decimal TotalRevenue { get; set; }
    public decimal RevenueThisMonth { get; set; }

    // Charts
    public List<MonthlyValueDto> MonthlyRevenue { get; set; } = new();
    public List<MonthlyCountDto> MonthlyNewUsers { get; set; } = new();

    // Top packages
    public List<PackageStatDto> TopPackages { get; set; } = new();

    // Recent payments
    public List<PaymentDto> RecentPayments { get; set; } = new();
}
```

---

### Task 2: BE AdminDashboardController + SQL queries

**Files:**
- Create: `backend/src/FitnessTrainingSystem.WebApi/Controllers/AdminDashboardController.cs`

**Interfaces:**
- Consumes: `ApplicationDbContext`, `AdminDashboardDto`, `MonthlyValueDto`, `MonthlyCountDto`, `PackageStatDto`, `PaymentDto`
- Produces: `GET /api/admin/dashboard` endpoint

- [ ] **Step 1: Create AdminDashboardController.cs**

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.DTOs.Dashboard;
using FitnessTrainingSystem.Application.DTOs.Payments;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminDashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var now = DateTime.UtcNow;
        var firstOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var twelveMonthsAgo = firstOfMonth.AddMonths(-11);

        // Total users
        var totalUsers = await _context.Users.CountAsync();

        // New users this month
        var newUsersThisMonth = await _context.Users
            .CountAsync(u => u.CreatedAt >= firstOfMonth);

        // Active subscriptions (ACTIVE + not expired)
        var activeSubs = await _context.MembershipSubscriptions
            .CountAsync(s => s.Status == "ACTIVE" && s.EndDate >= now);

        // Expired subscriptions
        var expiredSubs = await _context.MembershipSubscriptions
            .CountAsync(s => s.Status == "CANCELLED" || (s.Status == "ACTIVE" && s.EndDate < now));

        double subRate = totalUsers > 0 ? Math.Round((double)activeSubs / totalUsers * 100, 1) : 0;

        // Total revenue from successful PayOS payments
        var totalRevenue = await _context.Payments
            .Where(p => p.Status == "SUCCESS" && p.PaymentMethod == "PayOs")
            .SumAsync(p => p.Amount);

        // Revenue this month
        var revenueThisMonth = await _context.Payments
            .Where(p => p.Status == "SUCCESS" && p.PaymentMethod == "PayOs" && p.PaidAt >= firstOfMonth)
            .SumAsync(p => p.Amount);

        // Monthly revenue (last 12 months)
        var monthlyRevenue = await _context.Payments
            .Where(p => p.Status == "SUCCESS" && p.PaymentMethod == "PayOs" && p.PaidAt >= twelveMonthsAgo)
            .GroupBy(p => new { Year = p.PaidAt!.Value.Year, Month = p.PaidAt.Value.Month })
            .Select(g => new MonthlyValueDto
            {
                Month = g.Key.Year + "-" + g.Key.Month.ToString("D2"),
                Amount = g.Sum(p => p.Amount)
            })
            .OrderBy(m => m.Month)
            .ToListAsync();

        // Fill missing months with zero
        var revenueMap = monthlyRevenue.ToDictionary(m => m.Month);
        var fullMonthlyRevenue = new List<MonthlyValueDto>();
        for (int i = 0; i < 12; i++)
        {
            var dt = twelveMonthsAgo.AddMonths(i);
            var key = dt.Year + "-" + dt.Month.ToString("D2");
            fullMonthlyRevenue.Add(revenueMap.ContainsKey(key)
                ? revenueMap[key]
                : new MonthlyValueDto { Month = key, Amount = 0 });
        }

        // Monthly new users (last 12 months)
        var monthlyNewUsers = await _context.Users
            .Where(u => u.CreatedAt >= twelveMonthsAgo)
            .GroupBy(u => new { Year = u.CreatedAt.Year, Month = u.CreatedAt.Month })
            .Select(g => new MonthlyCountDto
            {
                Month = g.Key.Year + "-" + g.Key.Month.ToString("D2"),
                Count = g.Count()
            })
            .OrderBy(m => m.Month)
            .ToListAsync();

        var usersMap = monthlyNewUsers.ToDictionary(m => m.Month);
        var fullMonthlyUsers = new List<MonthlyCountDto>();
        for (int i = 0; i < 12; i++)
        {
            var dt = twelveMonthsAgo.AddMonths(i);
            var key = dt.Year + "-" + dt.Month.ToString("D2");
            fullMonthlyUsers.Add(usersMap.ContainsKey(key)
                ? usersMap[key]
                : new MonthlyCountDto { Month = key, Count = 0 });
        }

        // Top 5 packages by payment count (from payments via orders)
        var topPackages = await _context.Payments
            .Where(p => p.Status == "SUCCESS" && p.PaymentMethod == "PayOs")
            .Join(_context.Orders,
                p => p.OrderId,
                o => o.Id,
                (p, o) => new { p, o })
            .Join(_context.ProductPackages,
                joined => joined.o.PackageId,
                pp => pp.Id,
                (joined, pp) => new { joined.p, joined.o, pp })
            .GroupBy(x => new { x.pp.Id, x.pp.Name })
            .Select(g => new PackageStatDto
            {
                PackageName = g.Key.Name,
                Count = g.Count(),
                Revenue = g.Sum(x => x.p.Amount)
            })
            .OrderByDescending(p => p.Count)
            .Take(5)
            .ToListAsync();

        // Recent 10 payments
        var recentPayments = await _context.Payments
            .Where(p => p.PaymentMethod == "PayOs")
            .Join(_context.Orders,
                p => p.OrderId,
                o => o.Id,
                (p, o) => new { p, o })
            .Join(_context.Users,
                joined => joined.o.UserId,
                u => u.Id,
                (joined, u) => new { joined.p, joined.o, u })
            .Join(_context.ProductPackages,
                joined => joined.o.PackageId,
                pp => pp.Id,
                (joined, pp) => new PaymentDto
                {
                    Id = joined.p.Id,
                    OrderId = joined.p.OrderId,
                    OrderCode = joined.o.OrderCode,
                    PaymentMethod = joined.p.PaymentMethod,
                    TransactionCode = joined.p.TransactionCode,
                    Amount = joined.p.Amount,
                    Status = joined.p.Status,
                    PaidAt = joined.p.PaidAt,
                    UserId = joined.o.UserId,
                    UserName = joined.u.Fullname,
                    UserEmail = joined.u.Email,
                    PackageName = pp.Name
                })
            .OrderByDescending(p => p.PaidAt)
            .Take(10)
            .ToListAsync();

        var dto = new AdminDashboardDto
        {
            TotalUsers = totalUsers,
            NewUsersThisMonth = newUsersThisMonth,
            ActiveSubscriptions = activeSubs,
            ExpiredSubscriptions = expiredSubs,
            SubscriptionRate = subRate,
            TotalRevenue = totalRevenue,
            RevenueThisMonth = revenueThisMonth,
            MonthlyRevenue = fullMonthlyRevenue,
            MonthlyNewUsers = fullMonthlyUsers,
            TopPackages = topPackages,
            RecentPayments = recentPayments
        };

        return Ok(dto);
    }
}
```

---

### Task 3: Install recharts on FE

- [ ] **Step 1: Install recharts**

```bash
cd frontend
npm install recharts
```

---

### Task 4: Rewrite AdminDashboard.tsx

**Files:**
- Modify: `frontend/src/pages/admin/AdminDashboard.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/dashboard` → `AdminDashboardDto`

- [ ] **Step 1: Read current file to confirm structure**

- [ ] **Step 2: Rewrite AdminDashboard.tsx**

Full rewrite including:
- 6 stat cards row
- Revenue bar chart + User growth line chart side by side
- Top packages table + Recent payments table

```tsx
import React, { useMemo } from 'react'
import {
  Box, Flex, Heading, Text, Grid, HStack, VStack,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import { useAuthStore } from '../../store/useAuthStore'

const MotionBox = motion(Box)
const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const toVnd = (amount: number) => `₫${Math.round(amount).toLocaleString('vi-VN')}`

const AdminDashboard: React.FC = () => {
  const user = useAuthStore(s => s.user)
  const roleId = user?.roleId
  const isAdmin = roleId === 1

  const { data: dash, isLoading } = useSWR(isAdmin ? '/admin/dashboard' : null, fetcher)

  if (!isAdmin) {
    // PT dashboard — keep existing logic (unchanged, omitted for brevity)
    return <AdminLayout><Text color="white">PT Dashboard</Text></AdminLayout>
  }

  const statCards = dash ? [
    { label: 'Total Users', value: dash.totalUsers.toLocaleString(), color: 'white' },
    { label: 'Active Subscriptions', value: dash.activeSubscriptions.toLocaleString(), color: '#4ade80' },
    { label: 'Expired', value: dash.expiredSubscriptions.toLocaleString(), color: '#f87171' },
    { label: 'Revenue (Month)', value: toVnd(dash.revenueThisMonth), color: '#E03030' },
    { label: 'New Users (Month)', value: dash.newUsersThisMonth.toLocaleString(), color: '#60a5fa' },
    { label: 'Subscription Rate', value: `${dash.subscriptionRate}%`, color: '#fbbf24' },
  ] : []

  const totalRevenue = dash ? toVnd(dash.totalRevenue) : '---'

  return (
    <AdminLayout>
      <Box p="7" maxW="1280px" mx="auto">
        <Flex justify="space-between" align="center" mb="7">
          <Heading fontSize="28px" fontWeight="900" color="white" textTransform="uppercase">
            Dashboard
          </Heading>
          <Text fontSize="14px" color="#8A8A93">Total Revenue: <Text as="span" color="#E03030" fontWeight="800">{totalRevenue}</Text></Text>
        </Flex>

        {isLoading ? (
          <Flex justify="center" py="20"><Spinner color="#E03030" size="xl" /></Flex>
        ) : !dash ? (
          <Text color="red.500">Failed to load dashboard data.</Text>
        ) : (
          <>
            {/* Stat Cards */}
            <Grid templateColumns="repeat(6, 1fr)" gap="4" mb="8">
              {statCards.map((stat, idx) => (
                <MotionBox
                  key={idx}
                  bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <Text fontSize="11px" color="#8A8A93" textTransform="uppercase" fontWeight="700" mb="2">{stat.label}</Text>
                  <Text fontSize="24px" fontWeight="900" color={stat.color} lineHeight="1">{stat.value}</Text>
                </MotionBox>
              ))}
            </Grid>

            {/* Charts Row */}
            <Grid templateColumns="repeat(2, 1fr)" gap="6" mb="8">
              <MotionBox
                bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              >
                <Heading fontSize="16px" color="white" mb="4" fontWeight="700">Monthly Revenue</Heading>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dash.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                    <XAxis dataKey="month" tick={{ fill: '#8A8A93', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#8A8A93', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#141720', border: '1px solid #1e2028', borderRadius: '8px', color: 'white' }}
                      formatter={(value: any) => toVnd(value)}
                    />
                    <Bar dataKey="amount" fill="#E03030" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </MotionBox>

              <MotionBox
                bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              >
                <Heading fontSize="16px" color="white" mb="4" fontWeight="700">New Users</Heading>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dash.monthlyNewUsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                    <XAxis dataKey="month" tick={{ fill: '#8A8A93', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#8A8A93', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#141720', border: '1px solid #1e2028', borderRadius: '8px', color: 'white' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#E03030" strokeWidth={2} dot={{ fill: '#E03030', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </MotionBox>
            </Grid>

            {/* Bottom section: Top Packages + Recent Payments */}
            <Grid templateColumns="1fr 1fr" gap="6">
              <MotionBox
                bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              >
                <Heading fontSize="16px" color="white" mb="4" fontWeight="700">Top Packages</Heading>
                {dash.topPackages.length > 0 ? (
                  <VStack align="stretch" spacing="3">
                    {dash.topPackages.map((pkg: any, idx: number) => (
                      <Flex key={idx} justify="space-between" align="center" p="3" bg="#0A0C10" borderRadius="8px">
                        <HStack spacing="3">
                          <Text color="#E03030" fontWeight="800" fontSize="13px">#{idx + 1}</Text>
                          <Text color="white" fontSize="13px" fontWeight="600">{pkg.packageName}</Text>
                        </HStack>
                        <HStack spacing="4">
                          <Text color="#8A8A93" fontSize="12px">{pkg.count} purchases</Text>
                          <Text color="#4ade80" fontSize="12px" fontWeight="700">{toVnd(pkg.revenue)}</Text>
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                ) : (
                  <Text color="#8A8A93" fontSize="13px">No package data yet.</Text>
                )}
              </MotionBox>

              <MotionBox
                bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
              >
                <Box p="6" pb="3">
                  <Heading fontSize="16px" color="white" fontWeight="700">Recent Payments</Heading>
                </Box>
                <Table variant="unstyled" size="sm">
                  <Thead bg="#0A0C10">
                    <Tr>
                      <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" px="4">User</Th>
                      <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" px="4" isNumeric>Amount</Th>
                      <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" px="4">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {dash.recentPayments.map((p: any) => (
                      <Tr key={p.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                        <Td color="white" borderColor="#1e2028" fontSize="12px" fontWeight="600" px="4">{p.userName || p.userEmail}</Td>
                        <Td color="white" borderColor="#1e2028" fontSize="12px" fontWeight="800" isNumeric px="4">{toVnd(p.amount)}</Td>
                        <Td borderColor="#1e2028" px="4">
                          <Badge
                            px="2" py="0.5" borderRadius="md" textTransform="none" fontSize="10px" fontWeight="700"
                            bg={p.status === 'SUCCESS' ? 'green.900' : p.status === 'FAILED' ? 'red.900' : 'yellow.900'}
                            color={p.status === 'SUCCESS' ? 'green.300' : p.status === 'FAILED' ? 'red.300' : 'yellow.300'}
                          >
                            {p.status === 'SUCCESS' ? 'Completed' : p.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                    {dash.recentPayments.length === 0 && (
                      <Tr><Td colSpan={3} textAlign="center" py="6" color="#8A8A93" fontSize="13px">No payments yet.</Td></Tr>
                    )}
                  </Tbody>
                </Table>
              </MotionBox>
            </Grid>
          </>
        )}
      </Box>
    </AdminLayout>
  )
}

export default AdminDashboard
```

---

### Task 5: Payment Detail Modal in AdminPayments.tsx

**Files:**
- Modify: `frontend/src/pages/admin/AdminPayments.tsx`

- [ ] **Step 1: Add state for selected payment + modal**

Add at line ~35 (with other states):
```tsx
const [selectedPayment, setSelectedPayment] = useState<any>(null)
```

- [ ] **Step 2: Add modal before closing `</AdminLayout>` (line ~340)**

```tsx
      {/* Payment Detail Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} isCentered>
        <ModalOverlay bg="rgba(0,0,0,0.7)" />
        <ModalContent bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" maxW="480px">
          <ModalHeader borderBottom="1px solid" borderColor="#1e2028">
            <HStack justify="space-between">
              <Heading fontSize="18px" color="white" fontWeight="700">Payment Detail</Heading>
              <IconButton
                aria-label="Close"
                icon={<FiX />}
                variant="ghost"
                color="#8A8A93"
                onClick={() => setSelectedPayment(null)}
              />
            </HStack>
          </ModalHeader>
          <ModalBody py="6">
            {selectedPayment && (
              <VStack align="stretch" spacing="4">
                <DetailRow label="Order Code" value={selectedPayment.orderCode?.toString()} mono />
                <DetailRow label="Transaction Code" value={selectedPayment.transactionCode || 'N/A'} mono />
                <DetailRow label="User" value={`${selectedPayment.userName || 'N/A'} (${selectedPayment.userEmail || ''})`} />
                <DetailRow label="Package" value={selectedPayment.packageName || 'N/A'} />
                <DetailRow label="Amount" value={toVnd(selectedPayment.amount)} color="#E03030" />
                <DetailRow label="Payment Method" value={selectedPayment.paymentMethod || 'N/A'} />
                <DetailRow label="Status" value={selectedPayment.status === 'SUCCESS' ? 'Completed' : selectedPayment.status}>
                  {(selectedPayment.status === 'SUCCESS' || selectedPayment.status === 'FAILED' || selectedPayment.status === 'PENDING') && (
                    <Badge ml="2" px="2" py="0.5" borderRadius="md" textTransform="none" fontSize="11px"
                      bg={selectedPayment.status === 'SUCCESS' ? 'green.900' : selectedPayment.status === 'FAILED' ? 'red.900' : 'yellow.900'}
                      color={selectedPayment.status === 'SUCCESS' ? 'green.300' : selectedPayment.status === 'FAILED' ? 'red.300' : 'yellow.300'}
                    >
                      {selectedPayment.status === 'SUCCESS' ? 'Completed' : selectedPayment.status}
                    </Badge>
                  )}
                </DetailRow>
                <DetailRow label="Paid At" value={selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'} />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor="#1e2028">
            <Button variant="ghost" color="#8A8A93" onClick={() => setSelectedPayment(null)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
```

- [ ] **Step 3: Add DetailRow helper component before main component**

Near the top of the file, after imports:
```tsx
const DetailRow: React.FC<{ label: string; value: string; mono?: boolean; color?: string; children?: React.ReactNode }> = ({ label, value, mono, color, children }) => (
  <Flex justify="space-between" align="center">
    <Text fontSize="13px" color="#8A8A93">{label}</Text>
    <HStack>
      <Text fontSize="13px" color={color || 'white'} fontWeight="600" fontFamily={mono ? 'monospace' : undefined}>{value}</Text>
      {children}
    </HStack>
  </Flex>
)
```

- [ ] **Step 4: Update View button onClick**

Change:
```tsx
<Button size="xs" variant="ghost" color="#3182ce" _hover={{ bg: 'rgba(49, 130, 206, 0.1)' }}>View</Button>
```
To:
```tsx
<Button size="xs" variant="ghost" color="#3182ce" _hover={{ bg: 'rgba(49, 130, 206, 0.1)' }} onClick={() => setSelectedPayment(t)}>View</Button>
```

- [ ] **Step 5: Add missing imports at top**

Ensure `import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, IconButton } from '@chakra-ui/react'` is present.
Add `import { FiX } from 'react-icons/fi'`.

---

### Task 6: Build & Verify

- [ ] **Step 1: Build BE**

```bash
cd backend
dotnet build
```

Expected: 0 errors

- [ ] **Step 2: Restart BE**

Kill old process on port 5007, start new one:
```bash
dotnet run --project src/FitnessTrainingSystem.WebApi
```

- [ ] **Step 3: Restart FE**

Kill old node processes, start:
```bash
cd frontend
npm run dev
```

- [ ] **Step 4: Verify endpoints**

```bash
# Test dashboard API (needs admin token)
curl http://localhost:5007/api/admin/dashboard -H "Authorization: Bearer <admin-token>"
```

Expected: Returns full AdminDashboardDto JSON with real data.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: admin dashboard with real analytics + payment detail modal"
```
